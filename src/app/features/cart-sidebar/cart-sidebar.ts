import { Component, EventEmitter, Output, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CartService } from '../../core/services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss',
})
export class CartSidebarComponent {
  @Output()
  closed = new EventEmitter<void>();

  readonly cartService = inject(CartService);

  private readonly fb = inject(FormBuilder);

  readonly discountPercentage = 10;

  readonly whatsappNumber = '918208315776';

  /**
   * Controls whether the "Customer Details" form overlay is visible.
   * false -> user sees the cart sidebar
   * true  -> user sees the checkout form (on top of the cart)
   */
  showCheckoutForm = false;

  locationShared = false;
  latitude: number | null = null;
  longitude: number | null = null;
  isSharingLocation = false;

  checkoutForm: FormGroup = this.fb.group({
    customerName: ['', [Validators.required, Validators.minLength(3)]],
    deliveryAddress: ['', [Validators.required, Validators.minLength(10)]],
    whatsappNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    alternateNumber: ['', [Validators.pattern(/^$|^[6-9]\d{9}$/)]],
    confirmOrder: [false, Validators.requiredTrue],
  });

  /**
   * Close the whole cart sidebar (emits to parent)
   */
  close(): void {
    this.closed.emit();
  }

  /**
   * Step 1: User clicks "Place Order on WhatsApp" in the cart footer.
   * This just opens the details form — nothing is sent yet.
   */
  openCheckoutForm(): void {
    if (this.cartService.items().length === 0) {
      return;
    }

    this.showCheckoutForm = true;
  }

  /**
   * User closes the form (✕ or clicking outside it).
   * Cart sidebar remains open underneath.
   */
  closeCheckoutForm(): void {
    this.showCheckoutForm = false;
  }

  shareLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported.');
      return;
    }

    this.isSharingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        this.locationShared = true;
        this.isSharingLocation = false;
      },
      () => {
        this.isSharingLocation = false;
        alert('Unable to fetch your location.');
      },
    );
  }

  getUnitPrice(product: Product): number {
    return Number(product.price.replace('₹', '').replace(/,/g, '').trim());
  }

  getDiscountedPrice(product: Product): number {
    const price = this.getUnitPrice(product);
    return Math.round(price - (price * this.discountPercentage) / 100);
  }

  getItemTotal(item: any): number {
    return this.getDiscountedPrice(item.product) * item.quantity;
  }

  getGrandTotal(): number {
    return this.cartService.items().reduce((total, item) => {
      return total + this.getUnitPrice(item.product) * item.quantity;
    }, 0);
  }

  getDiscountAmount(): number {
    return Math.round((this.getGrandTotal() * this.discountPercentage) / 100);
  }

  getFinalAmount(): number {
    return this.getGrandTotal() - this.getDiscountAmount();
  }

  /**
   * Step 2: User fills the form and confirms -> actually build message & open WhatsApp
   */
  confirmAndSendOrder(): void {
    if (this.cartService.items().length === 0) {
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const customer = this.checkoutForm.getRawValue();
    const orderId = 'ANJ-' + Date.now();

    let message = '';

    message += '🛍️ *Adhi & Nidhi Jewellery Order*';
    message += '\n\n';
    message += `Date : ${new Date().toLocaleString('en-IN')}\n\n`;
    message += '\n\n';
    message += `Order No : ${orderId}\n`;
    message += '\n\n';
    message += '============================';
    message += '\n';
    message += '*CUSTOMER DETAILS*';
    message += '\n';
    message += '============================';
    message += '\n';

    message += `👤 Name : ${customer.customerName}\n`;
    message += `📱 WhatsApp : ${customer.whatsappNumber}\n`;

    if (customer.alternateNumber) {
      message += `☎️ Alternate : ${customer.alternateNumber}\n`;
    }

    message += `📍 Address : ${customer.deliveryAddress}\n`;

    if (this.locationShared && this.latitude !== null && this.longitude !== null) {
      message += '\n';
      message += '📌 Live Location\n';
      message += `https://maps.google.com/?q=${this.latitude},${this.longitude}\n`;
    }

    message += '\n';
    message += '━━━━━━━━━━━━━━━━━━━━━━';
    message += '\n';
    message += '*🛍️ ORDER DETAILS*';
    message += '\n';
    message += '━━━━━━━━━━━━━━━━━━━━━━';
    message += '\n\n';

    this.cartService.items().forEach((item, index) => {
      message += `${index + 1}. ${item.product['product-code']}\n`;
      message += `Quantity : ${item.quantity}\n`;
      message += `Unit Price : ₹${this.getUnitPrice(item.product)}\n`;
      message += `Discount : ${this.discountPercentage}%\n`;
      message += `Price After Discount : ₹${this.getDiscountedPrice(item.product)}\n`;
      message += `Item Total : ₹${this.getItemTotal(item)}\n`;
      message += '\n';
    });

    message += '\n';
    message += `Total Items : ${this.cartService.totalItems()}\n\n`;
    message += '\n';
    message += '============================';
    message += '\n';
    message += '*PAYMENT SUMMARY*';
    message += '\n';
    message += '============================';
    message += '\n';

    message += `Grand Total : ₹${this.formatPrice(this.getGrandTotal())}\n`;
    message += `Discount (${this.discountPercentage}%) : -₹${this.getDiscountAmount()}\n`;
    message += `Final Amount : ₹${this.getFinalAmount()}\n`;

    message += '\n';
    message += '============================';
    message += '\n';
    message += 'Thank you for shopping with *Adhi & Nidhi Jewellery* 💜';

    const url = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');

    // Close the form after sending (optional — remove this line if you want it to stay open)
    this.showCheckoutForm = false;

    this.cartService.clearCart();
  }

  formatPrice(price: number): string {
    return price.toLocaleString('en-IN');
  }
}