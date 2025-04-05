import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryButtonComponent } from './order-history-button.component';

describe('OrderHistoryButtonComponent', () => {
  let component: OrderHistoryButtonComponent;
  let fixture: ComponentFixture<OrderHistoryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderHistoryButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderHistoryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
