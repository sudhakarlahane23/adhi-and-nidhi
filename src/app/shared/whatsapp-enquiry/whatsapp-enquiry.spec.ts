import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappEnquiry } from './whatsapp-enquiry';

describe('WhatsappEnquiry', () => {
  let component: WhatsappEnquiry;
  let fixture: ComponentFixture<WhatsappEnquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappEnquiry],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappEnquiry);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
