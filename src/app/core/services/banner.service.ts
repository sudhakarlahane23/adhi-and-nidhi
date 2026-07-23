import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Banner,
  DEFAULT_BANNER_POSITION,
  PLACEHOLDER_IMAGE
} from '../../models/banner.model';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private readonly http = inject(HttpClient);

  // -------------------------------------------------------
  // State
  // -------------------------------------------------------

  private readonly bannerSignal = signal<Banner[]>([]);

  private readonly loadingSignal = signal<boolean>(false);

  private readonly errorSignal = signal<boolean>(false);

  // -------------------------------------------------------
  // Public readonly state
  // -------------------------------------------------------

  readonly banners = computed(() => this.bannerSignal());

  readonly isLoading = computed(() => this.loadingSignal());

  readonly hasError = computed(() => this.errorSignal());

  /**
   * Active banners, normalized with safe defaults, sorted by displayOrder.
   */
  readonly activeBanners = computed(() =>
    this.bannerSignal()
      .filter(banner => banner.active)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  );

  readonly bannerCount = computed(() => this.activeBanners().length);

  // -------------------------------------------------------
  // Config
  // -------------------------------------------------------

  private readonly bannerJsonPath = 'assets/data/banner.json';

  // -------------------------------------------------------
  // Loading
  // -------------------------------------------------------

  loadBanners(): void {

    this.loadingSignal.set(true);

    this.errorSignal.set(false);

    this.http
      .get<Banner[]>(this.bannerJsonPath)
      .subscribe({

        next: (response) => {

          const normalized = (response || [])
            .map(banner => this.normalize(banner))
            .filter(banner => banner.active)
            .sort((a, b) => a.displayOrder - b.displayOrder);

          this.bannerSignal.set(normalized);

          this.loadingSignal.set(false);

        },

        error: error => {

          console.error('Unable to load banner JSON.', error);

          this.bannerSignal.set([]);

          this.loadingSignal.set(false);

          this.errorSignal.set(true);

        }

      });

  }

  refresh(): void {

    this.loadBanners();

  }

  getBannerById(id: number): Banner | undefined {

    return this.bannerSignal().find(banner => banner.id === id);

  }

  getFirstBanner(): Banner | null {

    const banners = this.activeBanners();

    return banners.length ? banners[0] : null;

  }

  getLastBanner(): Banner | null {

    const banners = this.activeBanners();

    return banners.length ? banners[banners.length - 1] : null;

  }

  // -------------------------------------------------------
  // Normalization — guarantees every banner has the fields
  // the template relies on, so a partially-filled JSON entry
  // never breaks rendering (section 22, graceful fallback).
  // -------------------------------------------------------

  private normalize(banner: Banner): Banner {

    return {
      ...banner,
      image: banner.image || PLACEHOLDER_IMAGE,
      alt: banner.alt || banner.heading || 'Adhi & Nidhi Jewellery banner',
      position: banner.position || DEFAULT_BANNER_POSITION,
      textAnimation: banner.textAnimation || 'fade',
      imageAnimation: banner.imageAnimation || 'ken-burns',
      transitionEffect: banner.transitionEffect || 'crossfade',
      overlay: banner.overlay ?? true,
      overlayOpacity: banner.overlayOpacity ?? 0.35,
      displayOrder: banner.displayOrder ?? banner.id ?? 0
    };

  }

}
