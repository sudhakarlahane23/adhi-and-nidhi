import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Founders } from './founders';

describe('Founders', () => {
  let component: Founders;
  let fixture: ComponentFixture<Founders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Founders],
    }).compileComponents();

    fixture = TestBed.createComponent(Founders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
