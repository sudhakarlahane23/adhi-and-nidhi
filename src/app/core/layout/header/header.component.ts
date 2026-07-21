import { Component, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WhatsappEnquiryComponent } from '../../../shared/whatsapp-enquiry/whatsapp-enquiry';
import { CartService } from '../../services/cart.service';
import { CartSidebarComponent } from '../../../features/cart-sidebar/cart-sidebar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, WhatsappEnquiryComponent, CartSidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly cartService = inject(CartService);
  readonly totalItems = this.cartService.totalItems;

  menuOpen = false;
  showWhatsappPopup = false;
  showCart = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  openWhatsappPopup(): void {
    this.showWhatsappPopup = true;
    this.closeMenu();
  }

  closeWhatsappPopup(): void {
    this.showWhatsappPopup = false;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {

    if (this.showWhatsappPopup) {
      this.closeWhatsappPopup();
      return;
    }

    if (this.showCart) {
      this.closeCart();
      return;
    }

    this.closeMenu();
  }

  openCart(): void {
    this.showCart = true;
    this.closeMenu();
  }

  closeCart(): void {
    this.showCart = false;
  }
}
