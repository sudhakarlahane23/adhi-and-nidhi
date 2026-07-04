import { Component } from '@angular/core';
import { AnnouncementBarComponent } from '../../core/layout/announcement-bar/announcement-bar.component';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { FooterComponent } from '../../core/layout/footer/footer.component';
import { WhatsappFloatComponent } from '../../shared/components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [AnnouncementBarComponent, HeaderComponent, FooterComponent, WhatsappFloatComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {}
