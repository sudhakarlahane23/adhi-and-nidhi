// =============================================================
// BANNER MODEL
// Adhi & Nidhi Jewellery — Premium Hero Carousel
// Fully JSON-driven, strongly typed, future-proof.
// =============================================================

/**
 * Horizontal/vertical/text alignment for one breakpoint tier.
 */
export interface BannerPosition {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
  textAlign: 'left' | 'center' | 'right';
}

/**
 * Independent content placement per breakpoint.
 * Desktop and mobile are fully decoupled, as required.
 */
export interface BannerPositionConfig {
  desktop: BannerPosition;
  tablet: BannerPosition;
  mobile: BannerPosition;
}

export type ButtonStyle = 'filled' | 'outline' | 'ghost';
export type ButtonShape = 'rounded' | 'square';

export interface BannerButton {
  text: string;
  link: string;
  style?: ButtonStyle;
  shape?: ButtonShape;
  /** Optional icon name, rendered via <i class="bi bi-{icon}"> (Bootstrap Icons) */
  icon?: string;
  target?: '_self' | '_blank';
}

export type TextAnimation =
  | 'fade'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'zoom'
  | 'scale'
  | 'blur-in'
  | 'none';

export type ImageAnimation =
  | 'zoom-in'
  | 'zoom-out'
  | 'slow-pan'
  | 'ken-burns'
  | 'fade'
  | 'none';

export type TransitionEffect = 'slide' | 'fade' | 'crossfade';

/**
 * Reserved for future slide types (section 24 — future-ready architecture).
 * Today only 'image' is implemented; the component/template are structured
 * so 'video' / 'youtube' / 'lottie' can be added without breaking changes.
 */
export type BannerMediaType = 'image' | 'video' | 'youtube' | 'lottie';

export interface Banner {
  id: number;

  // ---------------------------------------------------------
  // Content
  // ---------------------------------------------------------
  title?: string;
  /** Small eyebrow/tag shown above the heading, e.g. "NEW ARRIVAL" */
  eyebrow?: string;
  heading: string;
  subHeading?: string;
  description?: string;

  // ---------------------------------------------------------
  // Merchandising
  // ---------------------------------------------------------
  badge?: 'New' | 'Sale' | 'Trending' | 'Limited Edition' | string;
  price?: string;
  offer?: string;
  isNew?: boolean;

  // ---------------------------------------------------------
  // Buttons
  // ---------------------------------------------------------
  primaryButton?: BannerButton;
  secondaryButton?: BannerButton;

  // ---------------------------------------------------------
  // Media
  // ---------------------------------------------------------
  mediaType?: BannerMediaType;
  image: string;
  mobileImage?: string;
  /** Optional AVIF/WebP sources for <picture>, in preference order */
  imageSources?: { srcset: string; type: string }[];
  alt: string;
  /** Load eagerly + fetchpriority=high (first slide only) */
  priority?: boolean;

  // ---------------------------------------------------------
  // Position (independent desktop/tablet/mobile)
  // ---------------------------------------------------------
  position: BannerPositionConfig;

  // ---------------------------------------------------------
  // Animation
  // ---------------------------------------------------------
  textAnimation?: TextAnimation;
  animationDelay?: number;
  imageAnimation?: ImageAnimation;
  imageAnimationSpeed?: number;
  transitionEffect?: TransitionEffect;

  // ---------------------------------------------------------
  // Styling
  // ---------------------------------------------------------
  overlay?: boolean;
  overlayOpacity?: number;
  textColor?: string;
  buttonColor?: string;
  backgroundColor?: string;

  // ---------------------------------------------------------
  // Behaviour
  // ---------------------------------------------------------
  interval?: number;

  // ---------------------------------------------------------
  // Visibility / ordering
  // ---------------------------------------------------------
  active: boolean;
  displayOrder: number;

  // ---------------------------------------------------------
  // SEO
  // ---------------------------------------------------------
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Global carousel-level configuration, independent of individual slides.
 * Can be JSON-driven too (e.g. assets/data/banner-config.json) or supplied
 * as component inputs.
 */
export interface BannerCarouselConfig {
  autoplay: boolean;
  interval: number;
  transitionDuration: number;
  transitionTimingFunction: string;
  transitionEffect: TransitionEffect;
  pauseOnHover: boolean;
  pauseOnTouch: boolean;
  pauseOnFocus: boolean;
  pauseOnHiddenTab: boolean;
  enableKeyboard: boolean;
  enableMouseWheel: boolean;
  enableTouchSwipe: boolean;
  enableDrag: boolean;
  swipeThreshold: number;
}

export const DEFAULT_CAROUSEL_CONFIG: BannerCarouselConfig = {
  autoplay: true,
  interval: 5000,
  transitionDuration: 700,
  transitionTimingFunction: 'ease-in-out',
  transitionEffect: 'crossfade',
  pauseOnHover: true,
  pauseOnTouch: true,
  pauseOnFocus: true,
  pauseOnHiddenTab: true,
  enableKeyboard: true,
  enableMouseWheel: true,
  enableTouchSwipe: true,
  enableDrag: true,
  swipeThreshold: 60
};

/**
 * Sensible fallback used whenever a banner is missing its `position` block,
 * or when an image fails to load (section 22 — graceful fallback).
 */
export const DEFAULT_BANNER_POSITION: BannerPositionConfig = {
  desktop: { horizontal: 'left', vertical: 'center', textAlign: 'left' },
  tablet: { horizontal: 'left', vertical: 'center', textAlign: 'left' },
  mobile: { horizontal: 'center', vertical: 'bottom', textAlign: 'center' }
};

export const PLACEHOLDER_IMAGE = 'assets/images/banners/placeholder.svg';
