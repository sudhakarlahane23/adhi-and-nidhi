import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WhatsappEnquiryComponent } from '../../../shared/whatsapp-enquiry/whatsapp-enquiry';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, WhatsappEnquiryComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  menuOpen = false;
  showWhatsappPopup = false;

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
    } else {
      this.closeMenu();
    }
  }
}
