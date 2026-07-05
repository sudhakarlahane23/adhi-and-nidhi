import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-whatsapp-enquiry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './whatsapp-enquiry.html',
  styleUrl: './whatsapp-enquiry.scss'
})
export class WhatsappEnquiryComponent {

  @Output()
  closed = new EventEmitter<void>();

  private readonly whatsappNumber = '918208315776';

  private fb = inject(FormBuilder);

  readonly enquiryForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],

    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/)
      ]
    ],

    house: [
      '',
      Validators.required
    ],

    area: [
      '',
      Validators.required
    ],

    city: [
      '',
      Validators.required
    ],

    pincode: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{6}$/)
      ]
    ],

    enquiryType: [
      '',
      Validators.required
    ],

    message: [
      '',
      [
        Validators.required,
        Validators.minLength(10)
      ]
    ]

  });

  locationShared = false;

  latitude = '';

  longitude = '';

  googleMapLink = '';

  /**
   * Share Current Location
   */
  shareLocation(): void {

    if (!navigator.geolocation) {

      alert('Geolocation is not supported.');

      return;

    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        this.latitude = position.coords.latitude.toString();

        this.longitude = position.coords.longitude.toString();

        this.googleMapLink =
          `https://maps.google.com/?q=${this.latitude},${this.longitude}`;

        this.locationShared = true;

      },

      () => {

        alert('Unable to fetch your current location.');

      }

    );

  }

  /**
   * Open WhatsApp
   */
  sendWhatsapp(): void {

    if (this.enquiryForm.invalid) {

      this.enquiryForm.markAllAsTouched();

      return;

    }

    const form = this.enquiryForm.getRawValue();

    const message = `
*New Customer Enquiry*

👤 *Full Name*
${form.name}

📞 *Mobile*
${form.mobile}

🏠 *House / Flat*
${form.house}

📍 *Area*
${form.area}

🏙️ *City*
${form.city}

📮 *Pincode*
${form.pincode}

📂 *Enquiry Type*
${form.enquiryType}

💬 *Message*
${form.message}

📍 *Google Location*
${this.locationShared ? this.googleMapLink : 'Not Shared'}

🌐 Website
https://adhiandnidhijewellery.com
`;

    const whatsappUrl =
      `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;

    const newWindow = window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer'
    );

    if (!newWindow) {
      window.location.href = whatsappUrl;
    }

    this.enquiryForm.reset();

    this.locationShared = false;

    this.googleMapLink = '';

    this.latitude = '';

    this.longitude = '';

    this.close();

  }

  /**
   * Close Popup
   */
  close(): void {

    this.closed.emit();

  }

}