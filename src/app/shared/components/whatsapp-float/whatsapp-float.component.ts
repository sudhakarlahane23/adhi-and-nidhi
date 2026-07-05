import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-float',
  standalone: true,
  template: `
    <a class="whatsapp-float" href="https://wa.me/8208315776" target="_blank" aria-label="Contact on WhatsApp">
      <span>💬</span>
    </a>
  `,
  styles: [
    `.whatsapp-float { position: fixed; right: 1.2rem; bottom: 1.2rem; width: 3.4rem; height: 3.4rem; display: grid; place-items: center; border-radius: 50%; background: #25d366; color: #fff; box-shadow: 0 10px 25px rgba(37, 211, 102, 0.25); text-decoration: none; z-index: 1050; }`
  ],
})
export class WhatsappFloatComponent {}
