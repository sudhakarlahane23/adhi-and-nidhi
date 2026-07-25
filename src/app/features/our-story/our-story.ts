import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { FooterComponent } from '../../core/layout/footer/footer.component';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { AnnouncementBarComponent } from '../../core/layout/announcement-bar/announcement-bar.component';
import { BannerComponent } from '../../shared/banner/banner.component';
import { Founders } from '../founders/founders';
import { FirstFourSupporters } from '../first-four-supporters/first-four-supporters';
import { Categories } from '../categories/categories';
// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';

interface JourneyStep {
  icon: string;      // bootstrap-icons class, e.g. 'bi-people'
  title: string;      // supports <br> via innerHTML
  description: string;
}

interface TrustItem {
  icon: string;
  label: string;      // supports <br> via innerHTML
}

@Component({
  selector: 'app-our-story',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    AnnouncementBarComponent,
    FooterComponent,
    BannerComponent,
    Founders,
    FirstFourSupporters,
    Categories
  ],
  templateUrl: './our-story.html',
  styleUrl: './our-story.scss',
})
export class OurStory implements OnDestroy {
  private readonly productService = inject(ProductService);
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  readonly products = this.productService.products;
  readonly featuredProducts = this.productService.featuredProducts;
  // readonly categories = this.productService.categories;
  readonly currentSlide = signal(0);
  readonly isPaused = signal(false);

   journeySteps: JourneyStep[] = [
    {
      icon: '<i class="fa-solid fa-heart"></i>',
      title: 'Inspired by<br>Adhi & Nidhi',
      description: 'Two little hearts who inspired a beautiful dream.'
    },
    {
      icon: '<i class="fa-solid fa-lightbulb"></i>',
      title: 'A Dream<br>Is Born',
      description: 'To provide beautiful jewellery at honest & affordable prices.'
    },
    {
      icon: '<i class="fa-solid fa-hand-holding-heart"></i>',
      title: 'Supported by<br>You',
      description: 'Our first customers believed in us and encouraged us.'
    },
    {
      icon: '<i class="fa-solid fa-gem"></i>',
      title: 'Growing with<br>Trust',
      description: 'Your love and trust helped us grow into a brand families trust.'
    },
    {
      icon: '<i class="fa-solid fa-trophy"></i>',
      title: 'And This Is<br>Just the Beginning',
      description: 'More beautiful designs, more happy families, more milestones ahead.'
    }
  ];

  trustItems: TrustItem[] = [
    { icon: '<i class="fa-solid fa-crown"></i>', label: 'Affordable<br>Luxury' },
    { icon: '<i class="fa-solid fa-people-roof"></i>', label: 'Family<br>Owned' },
    { icon: '<i class="fa-solid fa-medal"></i>', label: 'Trusted<br>Quality' },
    { icon: '<i class="fa-solid fa-truck-arrow-right"></i>', label: 'Fast & Safe<br>Delivery' },
    { icon: '<i class="fa-solid fa-hand-holding-hand"></i>', label: 'Quick<br>Support' },
    { icon: '<i class="fa-solid fa-face-grin-stars"></i>', label: 'Happy<br>Customers' }
  ];

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  pauseAutoplay(): void {
    this.isPaused.set(true);
  }

  resumeAutoplay(): void {
    this.isPaused.set(false);
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
  }
}
