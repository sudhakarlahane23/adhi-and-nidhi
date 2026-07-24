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
// import { BannerComponent } from '../../shared/banner/banner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    AnnouncementBarComponent,
    FooterComponent,
    BannerComponent,
    Founders,
    FirstFourSupporters
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  private readonly productService = inject(ProductService);
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  readonly products = this.productService.products;
  readonly featuredProducts = this.productService.featuredProducts;
  readonly categories = this.productService.categories;
  // readonly customers = [
  //   {
  //     id: 1,
  //     name: 'Mrs. Mohini ji',
  //     city: 'Pune',
  //     highlight: 'Everyday Glow',
  //     review: 'The finish looked so elegant that everyone asked where I bought it from.',
  //     item: 'Bangles',
  //     image: '/assets/images/hero/mohiniji.jpeg',
  //   },
  //   {
  //     id: 2,
  //     name: 'Mrs. Anu ji',
  //     city: 'Pune',
  //     highlight: 'Festival Favorite',
  //     review: 'Perfect balance of style and affordability. I wore it for three events in a row.',
  //     item: 'Necklace',
  //     image: '/assets/images/hero/anuji.jpeg',
  //   },
  //   {
  //     id: 3,
  //     name: 'Mrs. Shahida ji',
  //     city: 'Pune',
  //     highlight: 'Everyday Glow',
  //     review: 'So lightweight and classy. It instantly lifted my whole look.',
  //     item: 'Bangles',
  //     image: '/assets/images/hero/shahidaji.jpeg',
  //   },
  //   {
  //     id: 4,
  //     name: 'Mrs. Archana ji',
  //     city: 'Pune',
  //     highlight: 'Wedding Pick',
  //     review: 'It looked rich and polished without being too heavy. Truly special.',
  //     item: 'Bracelet and neck chain',
  //     image: '/assets/images/hero/unknown.jpeg',
  //   },
  // ];
  // readonly slides = [
  //   {
  //     id: 1,
  //     image: '/assets/images/banners/banner-img-1.jpg',
  //     title: 'Bridal Collection',
  //     description: 'Discover statement necklaces, exquisite rings, and timeless bangles for your special day.',
  //   },
  //   {
  //     id: 2,
  //     image: '/assets/images/banners/banner-img-2.jpg',
  //     title: 'Statement Style',
  //     description: 'Celebrate every moment with bold, elegant imitation jewellery crafted to sparkle.',
  //   },
  //   {
  //     id: 3,
  //     image: '/assets/images/banners/banner-img-3.jpg',
  //     title: 'Modern Elegance',
  //     description: 'Refresh your look with contemporary pieces designed for festive and everyday charm.',
  //   },
  //   {
  //     id: 4,
  //     image: '/assets/images/banners/banner-img-4.jpg',
  //     title: 'Modern Elegance',
  //     description: 'Refresh your look with contemporary pieces designed for festive and everyday charm.',
  //   },
  //   {
  //     id: 5,
  //     image: '/assets/images/banners/banner-img-5.jpg',
  //     title: 'Modern Elegance',
  //     description: 'Refresh your look with contemporary pieces designed for festive and everyday charm.',
  //   },
  //   {
  //     id: 6,
  //     image: '/assets/images/banners/banner-img-6.jpg',
  //     title: 'Modern Elegance',
  //     description: 'Refresh your look with contemporary pieces designed for festive and everyday charm.',
  //   },
  //   {
  //     id: 7,
  //     image: '/assets/images/banners/banner-img-7.jpg',
  //     title: 'Modern Elegance',
  //     description: 'Refresh your look with contemporary pieces designed for festive and everyday charm.',
  //   }
  // ];
  readonly currentSlide = signal(0);
  readonly isPaused = signal(false);

  // ngOnInit(): void {
  //   this.startAutoplay();
  // }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  // startAutoplay(): void {
  //   this.stopAutoplay();
  //   this.autoplayTimer = setInterval(() => {
  //     if (!this.isPaused()) {
  //       this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
  //     }
  //   }, 3500);
  // }

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

  readonly categoryImageMap = computed(() => {
    const map: Record<string, string> = {};

    this.products().forEach(product => {
      if (!map[product.category]) {
        map[product.category] = product.image;
      }
    });

    return map;
  });
}
