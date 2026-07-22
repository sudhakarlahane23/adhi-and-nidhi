import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('toggles the navigation menu when the hamburger button is clicked', () => {
    const button = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;
    const nav = fixture.nativeElement.querySelector('.site-nav') as HTMLElement;

    expect(nav.classList.contains('is-open')).toBeFalse();

    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('is-open')).toBeTrue();

    button.click();
    fixture.detectChanges();

    expect(nav.classList.contains('is-open')).toBeFalse();
  });
});
