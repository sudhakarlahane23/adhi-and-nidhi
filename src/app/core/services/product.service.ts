import { Injectable, computed, signal } from '@angular/core';

import productsData from '../../../assets/data/products.json';
import {
  Product,
  ProductsResponse,
} from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly data = productsData as ProductsResponse;

  readonly products = signal<Product[]>(this.data.products);

  readonly categories = computed(() =>
    Array.from(
      new Set(this.products().map((product) => product.category))
    ).sort()
  );

  readonly featuredProducts = computed(() =>
    this.products().slice(0, 4)
  );
}