import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';

import { ProductService } from '../../core/services/product.service';
import { AnnouncementBarComponent } from '../../core/layout/announcement-bar/announcement-bar.component';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { FooterComponent } from '../../core/layout/footer/footer.component';
import { WhatsappFloatComponent } from '../../shared/components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    AnnouncementBarComponent,
    HeaderComponent,
    FooterComponent,
    WhatsappFloatComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly products = this.productService.products;
  readonly categories = this.productService.categories;
  readonly selectedCategory = signal<string>('All');
  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly pageSize = 400;

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    return this.products().filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesTerm =
        !term ||
        product['product-id'].toLowerCase().includes(term) ||
        product['product-code'].toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredProducts().length / this.pageSize)),
  );

  readonly visibleProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProducts().slice(start, start + this.pageSize);
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
    this.currentPage.set(1);
  }

  updateSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }

  getWhatsAppLink(product: any): string {
    const phone = '918208315776';
    const website = window.location.origin;
    const imageUrl = website + product.image;
    const message = `🛍️ *Adhi & Nidhi Jewellery - Product Enquiry*

    Hello,

    I am interested in purchasing the following jewellery.

    ━━━━━━━━━━━━━━━━━━━━━━

    📦 Product ID : ${product['product-id']}

    🏷️ Product Code : ${product['product-code']}

    💎 Category : ${product.category}

    💰 Price : ${product.price}

    🎁 Offer : ${product.offer ?? 'N/A'}

    🖼️ Product Image :
    ${imageUrl}

    ━━━━━━━━━━━━━━━━━━━━━━

    Please let me know:

    ✅ Availability
    ✅ Delivery Charges
    ✅ Payment Options
    ✅ Estimated Delivery Time

    Thank you.`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}
