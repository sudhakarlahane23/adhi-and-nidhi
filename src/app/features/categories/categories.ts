import { Component, computed, inject } from '@angular/core';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  private readonly productService = inject(ProductService);
  readonly products = this.productService.products;
  readonly categories = this.productService.categories;

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
