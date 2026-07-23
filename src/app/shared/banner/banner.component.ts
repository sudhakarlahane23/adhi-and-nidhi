import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BannerService } from '../../core/services/banner.service';

import {
  Banner,
  BannerCarouselConfig,
  DEFAULT_CAROUSEL_CONFIG,
  PLACEHOLDER_IMAGE
} from '../../models/banner.model';

@Component({
  selector: 'app-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  host: {
    class: 'hero-banner',
    tabindex: '0',
    role: 'region',
    'aria-roledescription': 'carousel',
    'aria-label': 'Featured jewellery collections'
  }
})
export class BannerComponent implements OnInit, AfterViewInit, OnDestroy {

  // -------------------------------------------------------
  // Dependencies
  // -------------------------------------------------------

  private readonly bannerService = inject(BannerService);

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private readonly document = inject(DOCUMENT);

  // -------------------------------------------------------
  // Config (section 6 / 17 — fully configurable behaviour)
  // -------------------------------------------------------

  readonly config: BannerCarouselConfig = { ...DEFAULT_CAROUSEL_CONFIG };

  readonly placeholderImage = PLACEHOLDER_IMAGE;

  // -------------------------------------------------------
  // Data
  // -------------------------------------------------------

  readonly banners = this.bannerService.activeBanners;

  readonly isLoading = this.bannerService.isLoading;

  readonly hasError = this.bannerService.hasError;

  // -------------------------------------------------------
  // Carousel state
  // -------------------------------------------------------

  readonly currentSlide = signal(0);

  readonly previousSlideIndex = signal<number | null>(null);

  readonly direction = signal<1 | -1>(1);

  readonly isPaused = signal(false);

  readonly isAnimating = signal(false);

  readonly isInViewport = signal(true);

  readonly prefersReducedMotion = signal(false);

  /** Tracks which slide images have failed to load, so a fallback shows. */
  readonly brokenImages = signal<Set<number>>(new Set());

  // -------------------------------------------------------
  // Derived state
  // -------------------------------------------------------

  readonly totalSlides = computed(() => this.banners().length);

  readonly hasMultipleSlides = computed(() => this.totalSlides() > 1);

  readonly currentBanner = computed<Banner | null>(() => {

    const banners = this.banners();

    if (!banners.length) {
      return null;
    }

    return banners[this.currentSlide()] ?? null;

  });

  readonly shouldAutoplay = computed(() =>
    this.config.autoplay &&
    this.hasMultipleSlides() &&
    !this.isPaused() &&
    this.isInViewport() &&
    !this.prefersReducedMotion()
  );

  // -------------------------------------------------------
  // Private runtime fields
  // -------------------------------------------------------

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  private wheelLocked = false;

  private pointerStartX = 0;

  private pointerCurrentX = 0;

  private isPointerDown = false;

  private intersectionObserver: IntersectionObserver | null = null;

  /**
   * Reactively starts/stops autoplay whenever anything it depends on
   * changes — banners finishing their async load, pause state, viewport
   * visibility, or reduced-motion preference. This replaces any need for
   * a one-shot "kick it off after init" call, which would otherwise race
   * the HTTP response.
   */
  private readonly autoplaySync = effect(() => {

    // Read the signal so this effect re-runs whenever it changes.
    this.shouldAutoplay();

    this.syncAutoplay();

  });

  // -------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------

  ngOnInit(): void {

    this.detectReducedMotionPreference();

    this.bannerService.loadBanners();

    this.document.addEventListener('visibilitychange', this.handleVisibilityChange);

  }

  ngAfterViewInit(): void {

    this.setupIntersectionObserver();

  }

  ngOnDestroy(): void {

    this.stopAutoplay();

    this.intersectionObserver?.disconnect();

    this.document.removeEventListener('visibilitychange', this.handleVisibilityChange);

  }

  // -------------------------------------------------------
  // Reduced motion (section 18 — accessibility)
  // -------------------------------------------------------

  private detectReducedMotionPreference(): void {

    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    this.prefersReducedMotion.set(query.matches);

    query.addEventListener('change', event => this.prefersReducedMotion.set(event.matches));

  }

  // -------------------------------------------------------
  // Viewport visibility (section 19 — performance)
  // Autoplay/animation pauses when the carousel scrolls off-screen
  // or the browser tab is hidden, so we never burn CPU/GPU for
  // something the user can't see.
  // -------------------------------------------------------

  private setupIntersectionObserver(): void {

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      entries => {

        const entry = entries[0];

        this.isInViewport.set(!!entry?.isIntersecting);

        this.syncAutoplay();

      },
      { threshold: 0.15 }
    );

    this.intersectionObserver.observe(this.elementRef.nativeElement);

  }

  private handleVisibilityChange = (): void => {

    if (!this.config.pauseOnHiddenTab) {
      return;
    }

    // if (this.document.hidden) {

    //   this.isPaused.set(true);

    // } else {

    //   this.isPaused.set(false);

    // }

    this.syncAutoplay();

  };

  // -------------------------------------------------------
  // Autoplay
  // -------------------------------------------------------

  startAutoplay(): void {

    this.stopAutoplay();

    if (!this.shouldAutoplay()) {
      return;
    }

    this.autoplayTimer = setInterval(() => {

      if (!this.shouldAutoplay()) {
        return;
      }

      if (this.isAnimating()) {
        return;
      }

      this.goToNext();

    }, this.getCurrentInterval());

  }

  stopAutoplay(): void {

    if (this.autoplayTimer) {

      clearInterval(this.autoplayTimer);

      this.autoplayTimer = null;

    }

  }

  restartAutoplay(): void {

    this.startAutoplay();

  }

  private syncAutoplay(): void {

    if (this.shouldAutoplay()) {

      this.restartAutoplay();

    } else {

      this.stopAutoplay();

    }

  }

  private getCurrentInterval(): number {

    const banner = this.currentBanner();

    return banner?.interval || this.config.interval;

  }

  // -------------------------------------------------------
  // Pause / resume triggers (section 17)
  // -------------------------------------------------------

  onMouseEnter(): void {
    // Un-comment if on mouse enter stop
    // if (this.config.pauseOnHover) {
    //   this.isPaused.set(true);
    //   this.syncAutoplay();
    // }

  }

  onMouseLeave(): void {

    // if (this.config.pauseOnHover) {
    //   this.isPaused.set(false);
    //   this.syncAutoplay();
    // }

  }

  @HostListener('focusin')
  onFocusIn(): void {

    // if (this.config.pauseOnFocus) {
    //   this.isPaused.set(true);
    //   this.syncAutoplay();
    // }

  }

  @HostListener('focusout')
  onFocusOut(): void {

    // if (this.config.pauseOnFocus) {
    //   this.isPaused.set(false);
    //   this.syncAutoplay();
    // }

  }

  // -------------------------------------------------------
  // Navigation
  // -------------------------------------------------------

  goToNext(): void {

    if (!this.hasMultipleSlides() || this.isAnimating()) {
      return;
    }

    const next = (this.currentSlide() + 1) % this.totalSlides();

    this.transitionTo(next, 1);

  }

  goToPrevious(): void {

    if (!this.hasMultipleSlides() || this.isAnimating()) {
      return;
    }

    const previous =
      (this.currentSlide() - 1 + this.totalSlides()) % this.totalSlides();

    this.transitionTo(previous, -1);

  }

  goToSlide(index: number): void {

    if (index === this.currentSlide()) {
      return;
    }

    if (index < 0 || index >= this.totalSlides()) {
      return;
    }

    const dir = index > this.currentSlide() ? 1 : -1;

    this.transitionTo(index, dir);

  }

  private transitionTo(index: number, dir: 1 | -1): void {

    this.previousSlideIndex.set(this.currentSlide());

    this.direction.set(dir);

    this.isAnimating.set(true);

    this.currentSlide.set(index);

    window.setTimeout(() => {

      this.isAnimating.set(false);

      this.previousSlideIndex.set(null);

    }, this.config.transitionDuration);

    this.restartAutoplay();

  }

  // -------------------------------------------------------
  // Keyboard (section 15 / 18)
  // Bound to the host, so it only fires while the carousel
  // itself (or a child control) has focus — not the whole page.
  // -------------------------------------------------------

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {

    if (!this.config.enableKeyboard) {
      return;
    }

    switch (event.key) {

      case 'ArrowLeft':
        event.preventDefault();
        this.goToPrevious();
        break;

      case 'ArrowRight':
        event.preventDefault();
        this.goToNext();
        break;

      case 'Home':
        event.preventDefault();
        this.goToSlide(0);
        break;

      case 'End':
        event.preventDefault();
        this.goToSlide(this.totalSlides() - 1);
        break;

      default:
        break;

    }

  }

  // -------------------------------------------------------
  // Mouse wheel navigation (section 15)
  // -------------------------------------------------------

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {

    if (!this.config.enableMouseWheel || !this.hasMultipleSlides()) {
      return;
    }

    const isHorizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);

    const magnitude = isHorizontalIntent ? event.deltaX : event.deltaY;

    if (Math.abs(magnitude) < 30) {
      return;
    }

    event.preventDefault();

    if (this.wheelLocked) {
      return;
    }

    this.wheelLocked = true;

    if (magnitude > 0) {
      this.goToNext();
    } else {
      this.goToPrevious();
    }

    window.setTimeout(() => { this.wheelLocked = false; }, this.config.transitionDuration);

  }

  // -------------------------------------------------------
  // Touch + drag (unified via Pointer Events) — section 16
  // Supports mouse-drag on desktop and swipe/velocity on touch.
  // -------------------------------------------------------

  onPointerDown(event: PointerEvent): void {

    if (!this.config.enableTouchSwipe && !this.config.enableDrag) {
      return;
    }

    this.isPointerDown = true;

    this.pointerStartX = event.clientX;

    this.pointerCurrentX = event.clientX;

    // if (this.config.pauseOnTouch) {
    //   this.isPaused.set(true);
    // }

  }

  onPointerMove(event: PointerEvent): void {

    if (!this.isPointerDown) {
      return;
    }

    this.pointerCurrentX = event.clientX;

  }

  onPointerUp(): void {

    if (!this.isPointerDown) {
      return;
    }

    this.isPointerDown = false;

    const distance = this.pointerStartX - this.pointerCurrentX;

    // if (this.config.pauseOnTouch) {
    //   this.isPaused.set(false);
    // }

    if (Math.abs(distance) >= this.config.swipeThreshold) {

      if (distance > 0) {
        this.goToNext();
      } else {
        this.goToPrevious();
      }

    } else {

      this.syncAutoplay();

    }

    this.pointerStartX = 0;

    this.pointerCurrentX = 0;

  }

  // -------------------------------------------------------
  // Image error handling (section 22 — graceful fallback)
  // -------------------------------------------------------

  onImageError(index: number): void {

    const updated = new Set(this.brokenImages());

    updated.add(index);

    this.brokenImages.set(updated);

  }

  isImageBroken(index: number): boolean {

    return this.brokenImages().has(index);

  }

  // -------------------------------------------------------
  // Presentation helpers (used from the template)
  // -------------------------------------------------------

  isActive(index: number): boolean {

    return this.currentSlide() === index;

  }

  /**
   * Combined position + text-alignment classes, mobile-first.
   * No JS-driven window-width checks — every tier is expressed
   * as CSS so it stays correct across resizes with zero reflow cost.
   */
  positionClasses(banner: Banner): string {

    const { desktop, tablet, mobile } = banner.position;

    return [
      `pos-m-${mobile.horizontal}-${mobile.vertical}`,
      `pos-t-${tablet.horizontal}-${tablet.vertical}`,
      `pos-d-${desktop.horizontal}-${desktop.vertical}`,
      `text-m-${mobile.textAlign}`,
      `text-t-${tablet.textAlign}`,
      `text-d-${desktop.textAlign}`
    ].join(' ');

  }

  textAnimationClass(banner: Banner): string {

    if (this.prefersReducedMotion()) {
      return 'ta-none';
    }

    return `ta-${banner.textAnimation || 'fade'}`;

  }

  imageAnimationClass(banner: Banner): string {

    if (this.prefersReducedMotion()) {
      return 'ia-none';
    }

    return `ia-${banner.imageAnimation || 'ken-burns'}`;

  }

  /**
   * Slide-effect inline transform. Only used when a banner's
   * transitionEffect is 'slide' — fade/crossfade rely purely on
   * the .active class + opacity in SCSS (GPU-friendly, no layout).
   */
  slideStyle(banner: Banner, index: number): Record<string, string> {

    if (banner.transitionEffect !== 'slide') {
      return {};
    }

    const current = this.currentSlide();

    if (index === current) {
      return { transform: 'translateX(0)' };
    }

    const isAheadInList = index > current;

    const offscreen = isAheadInList ? '100%' : '-100%';

    return { transform: `translateX(${offscreen})` };

  }

  animationDelayStyle(banner: Banner): Record<string, string> {

    const delay = banner.animationDelay ?? 0;

    return { '--text-delay': `${delay}ms` };

  }

  overlayStyle(banner: Banner): Record<string, string> {

    if (!banner.overlay) {
      return { display: 'none' };
    }

    return { '--overlay-opacity': `${banner.overlayOpacity ?? 0.35}` };

  }

  contentTextStyle(banner: Banner): Record<string, string> {

    return banner.textColor ? { color: banner.textColor } : {};

  }

  buttonStyleFor(banner: Banner): Record<string, string> {

    return banner.buttonColor
      ? { '--btn-color': banner.buttonColor }
      : {};

  }

  trackByBanner(_index: number, banner: Banner): number {

    return banner.id;

  }

  getCurrentSlideNumber(): number {

    return this.currentSlide() + 1;

  }

  getTotalSlideCount(): number {

    return this.totalSlides();

  }

  slideAriaLabel(banner: Banner, index: number): string {

    return `${banner.heading || 'Slide'} — ${index + 1} of ${this.totalSlides()}`;

  }

}
