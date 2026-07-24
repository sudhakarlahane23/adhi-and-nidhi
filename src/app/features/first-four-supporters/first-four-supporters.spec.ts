import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstFourSupporters } from './first-four-supporters';

describe('FirstFourSupporters', () => {
  let component: FirstFourSupporters;
  let fixture: ComponentFixture<FirstFourSupporters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstFourSupporters],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstFourSupporters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
