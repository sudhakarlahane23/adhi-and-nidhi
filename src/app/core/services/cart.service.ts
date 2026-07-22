import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../../models/product.model'; // <-- adjust path if needed

export interface CartItem {
  product: Product;   // <-- was: string
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly storageKey = 'adhi-nidhi-cart';

  readonly items = signal<CartItem[]>(this.loadCart());

  readonly totalItems = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly totalAmount = computed(() =>
    this.items().reduce((total, item) => {
      return total + (this.getPrice(item.product.price) * item.quantity);
    }, 0)
  );

  constructor() {
    this.saveCart();
  }

  addToCart(product: Product): void {

    const cart = [...this.items()];

    const existing = cart.find(
      item => item.product['product-id'] === product['product-id']
    );

    if (existing) {
      existing.quantity++;
    } else {
      cart.push({
        product,
        quantity: 1,
      });
    }

    this.items.set(cart);
    this.saveCart();
  }

  removeFromCart(productId: string): void {

    const cart = this.items().filter(
      item => item.product['product-id'] !== productId
    );

    this.items.set(cart);
    this.saveCart();
  }

  increaseQuantity(productId: string): void {

    const cart = [...this.items()];

    const item = cart.find(
      x => x.product['product-id'] === productId
    );

    if (item) {
      item.quantity++;
    }

    this.items.set(cart);
    this.saveCart();
  }

  decreaseQuantity(productId: string): void {

    const cart = [...this.items()];

    const item = cart.find(
      x => x.product['product-id'] === productId
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(productId);
      return;
    }

    this.items.set(cart);
    this.saveCart();
  }

  clearCart(): void {
    this.items.set([]);
    localStorage.removeItem(this.storageKey);
  }

  private getPrice(price: string): number {

    if (typeof price === 'number') {
      return price;
    }

    return Number(
      String(price).replace(/[^\d.]/g, '')
    );
  }

  private saveCart(): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.items())
    );
  }

  private loadCart(): CartItem[] {

    const data = localStorage.getItem(this.storageKey);

    if (!data) {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}