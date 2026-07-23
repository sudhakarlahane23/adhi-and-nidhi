#!/usr/bin/env node

/**
 * generate-banner-json.js
 * -------------------------------------------------------------
 * Scans assets/images/banners/ and generates (or updates)
 * assets/data/banner.json with sensible default values.
 *
 * - New images found on disk are added as new banner entries.
 * - Existing entries (matched by filename) are left untouched,
 *   so hand-edited copy/positions/animations are never overwritten.
 * - Entries whose image file no longer exists are flagged with
 *   `"missingImage": true` instead of being silently deleted.
 *
 * Usage:
 *   node generate-banner-json.js
 *   node generate-banner-json.js --images ./assets/images/banners --out ./assets/data/banner.json
 * -------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function getArg(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback;
}

const IMAGES_DIR = path.resolve(getArg('images', 'assets/images/banners'));
const OUTPUT_PATH = path.resolve(getArg('out', 'assets/data/banner.json'));

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

// Desktop-hero-sized images are treated as the primary "image"; anything
// with "-mobile" in the filename is treated as that entry's mobileImage.
const MOBILE_SUFFIX_PATTERN = /-mobile(\.[a-z0-9]+)$/i;

function titleCaseFromFilename(filename) {

  const base = path
    .basename(filename)
    .replace(MOBILE_SUFFIX_PATTERN, '$1')
    .replace(path.extname(filename), '');

  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim();

}

function defaultBannerEntry(id, imageRelativePath, mobileImageRelativePath, displayOrder) {

  const label = titleCaseFromFilename(imageRelativePath);

  return {
    id,
    title: label,
    eyebrow: '',
    heading: label,
    subHeading: '',
    description: '',
    badge: '',
    price: '',
    offer: '',
    primaryButton: {
      text: 'Shop Now',
      link: '/',
      style: 'filled',
      shape: 'rounded'
    },
    secondaryButton: null,
    image: imageRelativePath,
    mobileImage: mobileImageRelativePath || '',
    alt: label,
    priority: displayOrder === 1,
    position: {
      desktop: { horizontal: 'left', vertical: 'center', textAlign: 'left' },
      tablet: { horizontal: 'left', vertical: 'center', textAlign: 'left' },
      mobile: { horizontal: 'center', vertical: 'bottom', textAlign: 'center' }
    },
    textAnimation: 'fade',
    animationDelay: 0,
    imageAnimation: 'ken-burns',
    imageAnimationSpeed: 8000,
    transitionEffect: 'crossfade',
    overlay: true,
    overlayOpacity: 0.35,
    textColor: '#ffffff',
    buttonColor: '#b8860b',
    interval: 5000,
    active: true,
    displayOrder,
    seoTitle: label,
    seoDescription: ''
  };

}

function main() {

  if (!fs.existsSync(IMAGES_DIR)) {

    console.error(`Images folder not found: ${IMAGES_DIR}`);
    console.error('Create it and add banner images, e.g. assets/images/banners/diwali-gold-desktop.jpg');
    process.exit(1);

  }

  const allFiles = fs
    .readdirSync(IMAGES_DIR)
    .filter(file => VALID_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .filter(file => !file.toLowerCase().startsWith('placeholder.'));

  const mobileFiles = allFiles.filter(file => MOBILE_SUFFIX_PATTERN.test(file));

  const desktopFiles = allFiles.filter(file => !MOBILE_SUFFIX_PATTERN.test(file));

  const findMobileMatch = (desktopFile) => {

    const ext = path.extname(desktopFile);

    const base = path.basename(desktopFile, ext);

    return mobileFiles.find(mobile => mobile.startsWith(`${base}-mobile`)) || null;

  };

  let existing = [];

  if (fs.existsSync(OUTPUT_PATH)) {

    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    } catch (error) {
      console.warn(`Could not parse existing ${OUTPUT_PATH}, starting fresh.`, error.message);
    }

  }

  const existingByFilename = new Map(
    existing.map(entry => [path.basename(entry.image || ''), entry])
  );

  const result = [];

  let nextId = existing.reduce((max, entry) => Math.max(max, entry.id || 0), 0) + 1;

  let order = 0;

  for (const desktopFile of desktopFiles) {

    order += 1;

    const relativeImage = `assets/images/banners/${desktopFile}`;

    const mobileMatch = findMobileMatch(desktopFile);

    const relativeMobile = mobileMatch ? `assets/images/banners/${mobileMatch}` : '';

    const alreadyExists = existingByFilename.get(desktopFile);

    if (alreadyExists) {

      result.push({ ...alreadyExists, missingImage: false });

      continue;

    }

    const entry = defaultBannerEntry(nextId, relativeImage, relativeMobile, order);

    nextId += 1;

    result.push(entry);

  }

  // Flag entries whose backing image file has been removed from disk,
  // instead of silently deleting hand-authored copy.
  const desktopFileSet = new Set(desktopFiles);

  for (const entry of existing) {

    const filename = path.basename(entry.image || '');

    if (!desktopFileSet.has(filename) && !result.find(item => item.id === entry.id)) {

      result.push({ ...entry, missingImage: true, active: false });

    }

  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  console.log(`✔ Wrote ${result.length} banner entries to ${OUTPUT_PATH}`);

  const missing = result.filter(entry => entry.missingImage);

  if (missing.length) {
    console.warn(`⚠ ${missing.length} entr${missing.length === 1 ? 'y' : 'ies'} reference missing images and were deactivated:`);
    missing.forEach(entry => console.warn(`  - ${entry.image}`));
  }

}

main();
