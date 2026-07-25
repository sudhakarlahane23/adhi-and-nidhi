// format-category.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

const CATEGORY_LABELS: Record<string, string> = {
  'ms-long':      'Mangalsutra long',
  'ms-short':     'Mangalsutra short',
  'necklaces':    'Necklace',
  'earrings':     'Earring',
  'bangles':      'Bangle',
  'rings':        'Ring',
  'bracelets':    'Bracelet',
  'chains':       'Chain',
  'pendants':     'Pendant',
  // add more as your category list grows
};

@Pipe({
  name: 'formatCategory',
  standalone: true
})
export class FormatCategoryPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Use exact mapping if available
    if (CATEGORY_LABELS[value]) {
      return CATEGORY_LABELS[value];
    }

    // Fallback for anything not in the map, so it doesn't just break
    return value
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}