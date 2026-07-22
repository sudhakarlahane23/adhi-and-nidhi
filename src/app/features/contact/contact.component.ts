import { Component, inject } from '@angular/core';
import { AnnouncementBarComponent } from '../../core/layout/announcement-bar/announcement-bar.component';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { FooterComponent } from '../../core/layout/footer/footer.component';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    AnnouncementBarComponent,
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);

  isSubmitting = false;
  isSubmitted = false;

  contactForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/),
      ],
    ],
    email: ['', Validators.email],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  submit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = this.contactForm.value;

    console.log('Contact Form:', formData);

    // Email sending will be integrated here (EmailJS)

    setTimeout(() => {
      this.isSubmitting = false;
      this.isSubmitted = true;

      alert(
        'Thank you for contacting Adhi & Nidhi Jewellery. We will get back to you soon.'
      );

      this.contactForm.reset();
    }, 1000);
  }

  get f() {
    return this.contactForm.controls;
  }
}