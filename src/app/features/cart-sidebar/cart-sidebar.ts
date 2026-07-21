import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss',
})
export class CartSidebarComponent {

  @Output()
  closed = new EventEmitter<void>();

  readonly cartService = inject(CartService);

  /**
   * Change this value anytime.
   * Example:
   * 10 = 10%
   * 20 = 20%
   */
  readonly discountPercentage = 10;

  /**
   * Your WhatsApp Number
   * Format: CountryCode + Mobile Number
   */
  readonly whatsappNumber = '918208315776';

  close(): void {
    this.closed.emit();
  }

  /**
   * Convert "₹250" -> 250
   */
  getUnitPrice(product: Product): number {

    return Number(
      product.price
        .replace('₹', '')
        .replace(/,/g, '')
        .trim()
    );

  }

  /**
   * Price after discount
   */
  getDiscountedPrice(product: Product): number {

    const price = this.getUnitPrice(product);

    return Math.round(
      price - (price * this.discountPercentage / 100)
    );

  }

  /**
   * Total of one cart row
   */
  getItemTotal(item: any): number {

    return this.getDiscountedPrice(item.product) * item.quantity;

  }

  /**
   * Sum of original prices
   */
  getGrandTotal(): number {

    return this.cartService.items().reduce((total, item) => {

      return total + (this.getUnitPrice(item.product) * item.quantity);

    }, 0);

  }

  /**
   * Total discount amount
   */
  getDiscountAmount(): number {

    return Math.round(
      this.getGrandTotal() * this.discountPercentage / 100
    );

  }

  /**
   * Final amount
   */
  getFinalAmount(): number {

    return this.getGrandTotal() - this.getDiscountAmount();

  }

  /**
   * WhatsApp Order
   */
  placeOrderOnWhatsApp(): void {

    if (this.cartService.items().length === 0) {

      return;

    }

    let message = '';

    message += '🛍️ *Adhi & Nidhi Jewellery Order*';
    message += '\n\n';

    this.cartService.items().forEach((item, index) => {

      message += `${index + 1}. ${item.product['product-code']}\n`;
      message += `Qty : ${item.quantity}\n`;
      message += `Unit Price : ₹${this.getUnitPrice(item.product)}\n`;
      message += `Discount : ${this.discountPercentage}%\n`;
      message += `Price After Discount : ₹${this.getDiscountedPrice(item.product)}\n`;
      message += `Total : ₹${this.getItemTotal(item)}\n\n`;

    });

    message += '----------------------------\n';
    message += `Grand Total : ₹${this.getGrandTotal()}\n`;
    message += `Discount (${this.discountPercentage}%) : -₹${this.getDiscountAmount()}\n`;
    message += `Final Amount : ₹${this.getFinalAmount()}\n`;
    message += '----------------------------\n\n';

    message += 'Thank you.';

    const url =
      `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');

  }

}