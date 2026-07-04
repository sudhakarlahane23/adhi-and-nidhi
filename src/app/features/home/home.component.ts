import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { FooterComponent } from '../../core/layout/footer/footer.component';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { AnnouncementBarComponent } from '../../core/layout/announcement-bar/announcement-bar.component';
import { WhatsappFloatComponent } from '../../shared/components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, AnnouncementBarComponent, FooterComponent, WhatsappFloatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  readonly products = this.productService.products;
  readonly featuredProducts = this.productService.featuredProducts;
  readonly categories = this.productService.categories;

  readonly heroStats = computed(() => [
    { label: 'Years of Legacy', value: '25+' },
    { label: 'Certified Designs', value: '500+' },
    { label: 'Happy Clients', value: '10k' },
  ]);
}
