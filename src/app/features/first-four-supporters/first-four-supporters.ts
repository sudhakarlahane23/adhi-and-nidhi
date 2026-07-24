import { Component } from '@angular/core';

@Component({
  selector: 'app-first-four-supporters',
  imports: [],
  templateUrl: './first-four-supporters.html',
  styleUrl: './first-four-supporters.scss',
})
export class FirstFourSupporters {
  readonly customers = [
    {
      id: 1,
      name: 'Mrs. Mohini ji',
      city: 'Pune',
      highlight: 'Everyday Glow',
      review: 'The finish looked so elegant that everyone asked where I bought it from.',
      item: 'Bangles',
      image: '/assets/images/hero/mohiniji.jpeg',
    },
    {
      id: 2,
      name: 'Mrs. Anu ji',
      city: 'Pune',
      highlight: 'Festival Favorite',
      review: 'Perfect balance of style and affordability. I wore it for three events in a row.',
      item: 'Necklace',
      image: '/assets/images/hero/anuji.jpeg',
    },
    {
      id: 3,
      name: 'Mrs. Shahida ji',
      city: 'Pune',
      highlight: 'Everyday Glow',
      review: 'So lightweight and classy. It instantly lifted my whole look.',
      item: 'Bangles',
      image: '/assets/images/hero/shahidaji.jpeg',
    },
    {
      id: 4,
      name: 'Mrs. Archana ji',
      city: 'Pune',
      highlight: 'Wedding Pick',
      review: 'It looked rich and polished without being too heavy. Truly special.',
      item: 'Bracelet and neck chain',
      image: '/assets/images/hero/unknown.jpeg',
    },
  ];
}
