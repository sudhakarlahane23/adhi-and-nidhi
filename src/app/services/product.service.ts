import { Injectable, computed, signal } from '@angular/core';

import productsData from '../../assets/data/products.json';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly products = signal<Product[]>(productsData as Product[]);

  readonly categories = computed(() =>
    Array.from(new Set(this.products().map((product) => product.category))).sort()
  );

  readonly featuredProducts = computed(() =>
    this.products().filter((product) => product.badge === 'Featured').slice(0, 4)
  );
}
