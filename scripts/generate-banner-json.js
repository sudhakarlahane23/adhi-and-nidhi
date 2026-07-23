#!/usr/bin/env node

/**
 * generate-banner-json.js
 * -------------------------------------------------------------
 * Scans assets/images/banners/ and generates (or updates)
 * assets/data/banner.json with sensible default values.
 *
 * Features
 * -------------------------------------------------------------
 * ✔ Existing banners are preserved.
 * ✔ New banners are automatically added.
 * ✔ Missing images are flagged instead of deleted.
 * ✔ Rotating animation presets.
 * ✔ Rotating content positions.
 * ✔ Different image animation speeds.
 * ✔ Different animation delays.
 * -------------------------------------------------------------
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

function getArg(name, fallback) {
  const index = args.indexOf(`--${name}`);
  return index !== -1 && args[index + 1]
    ? args[index + 1]
    : fallback;
}

const IMAGES_DIR = path.resolve(
  getArg('images', 'src/assets/images/banners')
);

const OUTPUT_PATH = path.resolve(
  getArg('out', 'src/assets/data/banner.json')
);

const VALID_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif'
]);

const MOBILE_SUFFIX_PATTERN = /-mobile(\.[a-z0-9]+)$/i;

/*-------------------------------------------------------
| Animation Presets
-------------------------------------------------------*/

const ANIMATION_PRESETS = [
  {
    textAnimation: 'fade',
    imageAnimation: 'ken-burns',
    imageAnimationSpeed: 8000,
    animationDelay: 0
  },
  {
    textAnimation: 'slide-up',
    imageAnimation: 'slow-pan',
    imageAnimationSpeed: 9000,
    animationDelay: 100
  },
  {
    textAnimation: 'blur-in',
    imageAnimation: 'zoom-in',
    imageAnimationSpeed: 7500,
    animationDelay: 150
  },
  {
    textAnimation: 'slide-left',
    imageAnimation: 'zoom-out',
    imageAnimationSpeed: 8500,
    animationDelay: 100
  },
  {
    textAnimation: 'slide-right',
    imageAnimation: 'parallax',
    imageAnimationSpeed: 9500,
    animationDelay: 120
  },
  {
    textAnimation: 'flip-up',
    imageAnimation: 'float',
    imageAnimationSpeed: 8000,
    animationDelay: 80
  },
  {
    textAnimation: 'rotate-in',
    imageAnimation: 'slow-zoom',
    imageAnimationSpeed: 9000,
    animationDelay: 100
  },
  {
    textAnimation: 'bounce-up',
    imageAnimation: 'pan-left',
    imageAnimationSpeed: 8500,
    animationDelay: 70
  },
  {
    textAnimation: 'zoom',
    imageAnimation: 'pan-right',
    imageAnimationSpeed: 8000,
    animationDelay: 90
  },
  {
    textAnimation: 'fade-up',
    imageAnimation: 'ken-burns-reverse',
    imageAnimationSpeed: 9500,
    animationDelay: 120
  }
];

function getAnimationPreset(displayOrder) {
  return ANIMATION_PRESETS[
    (displayOrder - 1) % ANIMATION_PRESETS.length
  ];
}

/*-------------------------------------------------------
| Position Presets
-------------------------------------------------------*/

const POSITION_PRESETS = [
  {
    desktop: { horizontal: 'left', vertical: 'center', textAlign: 'left' },
    tablet: { horizontal: 'left', vertical: 'center', textAlign: 'left' },
    mobile: { horizontal: 'center', vertical: 'bottom', textAlign: 'center' }
  },
  {
    desktop: { horizontal: 'right', vertical: 'center', textAlign: 'right' },
    tablet: { horizontal: 'center', vertical: 'bottom', textAlign: 'center' },
    mobile: { horizontal: 'center', vertical: 'bottom', textAlign: 'center' }
  },
  {
    desktop: { horizontal: 'center', vertical: 'center', textAlign: 'center' },
    tablet: { horizontal: 'center', vertical: 'center', textAlign: 'center' },
    mobile: { horizontal: 'center', vertical: 'center', textAlign: 'center' }
  },
  {
    desktop: { horizontal: 'left', vertical: 'top', textAlign: 'left' },
    tablet: { horizontal: 'left', vertical: 'top', textAlign: 'left' },
    mobile: { horizontal: 'center', vertical: 'top', textAlign: 'center' }
  },
  {
    desktop: { horizontal: 'right', vertical: 'bottom', textAlign: 'right' },
    tablet: { horizontal: 'right', vertical: 'bottom', textAlign: 'right' },
    mobile: { horizontal: 'center', vertical: 'bottom', textAlign: 'center' }
  },
  {
    desktop: { horizontal: 'center', vertical: 'top', textAlign: 'center' },
    tablet: { horizontal: 'center', vertical: 'top', textAlign: 'center' },
    mobile: { horizontal: 'center', vertical: 'top', textAlign: 'center' }
  },
  {
    desktop: { horizontal: 'left', vertical: 'bottom', textAlign: 'left' },
    tablet: { horizontal: 'left', vertical: 'bottom', textAlign: 'left' },
    mobile: { horizontal: 'center', vertical: 'bottom', textAlign: 'center' }
  },
  {
    desktop: { horizontal: 'right', vertical: 'top', textAlign: 'right' },
    tablet: { horizontal: 'right', vertical: 'top', textAlign: 'right' },
    mobile: { horizontal: 'center', vertical: 'top', textAlign: 'center' }
  }
];

function getPositionPreset(displayOrder) {
  return POSITION_PRESETS[
    (displayOrder - 1) % POSITION_PRESETS.length
  ];
}

function titleCaseFromFilename(filename) {

  const base = path
    .basename(filename)
    .replace(MOBILE_SUFFIX_PATTERN, '$1')
    .replace(path.extname(filename), '');

  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

function defaultBannerEntry(
  id,
  imageRelativePath,
  mobileImageRelativePath,
  displayOrder
) {

  const label = titleCaseFromFilename(imageRelativePath);

  const animation = getAnimationPreset(displayOrder);

  const position = getPositionPreset(displayOrder);

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

    position,

    textAnimation: animation.textAnimation,

    animationDelay: animation.animationDelay,

    imageAnimation: animation.imageAnimation,

    imageAnimationSpeed: animation.imageAnimationSpeed,

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
    console.error(
      'Create it and add banner images, e.g. assets/images/banners/diwali-gold-desktop.jpg'
    );

    process.exit(1);

  }

  const allFiles = fs
    .readdirSync(IMAGES_DIR)
    .filter(file =>
      VALID_EXTENSIONS.has(path.extname(file).toLowerCase())
    )
    .filter(file => !file.toLowerCase().startsWith('placeholder.'));

  const mobileFiles = allFiles.filter(file =>
    MOBILE_SUFFIX_PATTERN.test(file)
  );

  const desktopFiles = allFiles.filter(
    file => !MOBILE_SUFFIX_PATTERN.test(file)
  );

  const findMobileMatch = desktopFile => {

    const ext = path.extname(desktopFile);

    const base = path.basename(desktopFile, ext);

    return (
      mobileFiles.find(file => file.startsWith(`${base}-mobile`)) || null
    );

  };

  let existing = [];

  if (fs.existsSync(OUTPUT_PATH)) {

    try {

      existing = JSON.parse(
        fs.readFileSync(OUTPUT_PATH, 'utf8')
      );

    } catch (error) {

      console.warn(
        `Could not parse existing ${OUTPUT_PATH}, starting fresh.`,
        error.message
      );

    }

  }

  const existingByFilename = new Map(

    existing.map(entry => [
      path.basename(entry.image || ''),
      entry
    ])

  );

  const result = [];

  let nextId =
    existing.reduce(
      (max, entry) => Math.max(max, entry.id || 0),
      0
    ) + 1;

  let order = 0;

  for (const desktopFile of desktopFiles) {

    order++;

    const relativeImage =
      `assets/images/banners/${desktopFile}`;

    const mobileMatch = findMobileMatch(desktopFile);

    const relativeMobile = mobileMatch
      ? `assets/images/banners/${mobileMatch}`
      : '';

    const alreadyExists =
      existingByFilename.get(desktopFile);

    if (alreadyExists) {

      // Preserve all manually edited values.
      result.push({

        ...alreadyExists,

        image: relativeImage,

        mobileImage: relativeMobile,

        priority: order === 1,

        displayOrder: order,

        missingImage: false

      });

      continue;

    }

    const entry = defaultBannerEntry(

      nextId,

      relativeImage,

      relativeMobile,

      order

    );

    nextId++;

    result.push(entry);

  }

  // Flag entries whose image no longer exists.

  const desktopFileSet = new Set(desktopFiles);

  for (const entry of existing) {

    const filename = path.basename(entry.image || '');

    const alreadyIncluded = result.some(
      item => item.id === entry.id
    );

    if (!desktopFileSet.has(filename) && !alreadyIncluded) {

      result.push({

        ...entry,

        missingImage: true,

        active: false

      });

    }

  }

  // Sort by display order.

  result.sort((a, b) =>

    (a.displayOrder || 0) -
    (b.displayOrder || 0)

  );

  fs.mkdirSync(

    path.dirname(OUTPUT_PATH),

    { recursive: true }

  );

  fs.writeFileSync(

    OUTPUT_PATH,

    JSON.stringify(result, null, 2) + '\n',

    'utf8'

  );

  console.log(
    `✔ Wrote ${result.length} banner entries to ${OUTPUT_PATH}`
  );

  const missing = result.filter(
    item => item.missingImage
  );

  if (missing.length) {

    console.warn(
      `⚠ ${missing.length} entr${missing.length === 1 ? 'y' : 'ies'} reference missing images and were deactivated:`
    );

    missing.forEach(item =>

      console.warn(`  - ${item.image}`)

    );

  }

}

main();