import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutModal } from './checkout-modal';
import { CartService } from '../../services/cart';
import { Listing } from '../../models/listing.model';

function makeListing(overrides: Partial<Listing> = {}): Listing {
  return {
    id: 1,
    title: 'Test Listing',
    description: 'A listing used for testing',
    price: 100,
    categories: ['Electronics'],
    condition: 'New',
    location: 'Halifax NS',
    ...overrides
  };
}

describe('CheckoutModal', () => {
  let fixture: ComponentFixture<CheckoutModal>;
  let component: CheckoutModal;
  let cart: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CheckoutModal]
    });

    fixture = TestBed.createComponent(CheckoutModal);
    component = fixture.componentInstance;
    cart = TestBed.inject(CartService);
  });

  it('starts with no order placed and empty buyer details', () => {
    expect(component.orderPlaced()).toBe(false);
    expect(component.buyerName).toBe('');
    expect(component.buyerEmail).toBe('');
  });

  it('stays hidden while checkout is closed', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal')).toBeNull();
  });

  it('renders the order summary and total once checkout is open', () => {
    cart.addToCart(makeListing({ id: 1, title: 'MacBook Pro', price: 1500, quantity: 5 }), 2);
    cart.openCheckout();

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('MacBook Pro');
    expect(text).toContain('3000');
  });

  describe('confirming a purchase', () => {
    beforeEach(() => {
      cart.addToCart(makeListing({ id: 1, price: 1500, quantity: 5 }), 2);
      cart.openCheckout();
      component.buyerName = 'Tibor';
      component.buyerEmail = 'tibor@example.com';
    });

    it('marks the order as placed', () => {
      component.onConfirm();

      expect(component.orderPlaced()).toBe(true);
    });

    it('captures the total before the cart is emptied', () => {
      component.onConfirm();

      expect(component.confirmedTotal()).toBe(3000);
    });

    it('empties the cart', () => {
      component.onConfirm();

      expect(cart.items()).toEqual([]);
      expect(cart.count()).toBe(0);
    });

    it('shows a confirmation naming the buyer', () => {
      component.onConfirm();
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent as string;
      expect(text).toContain('Tibor');
      expect(text).toContain('tibor@example.com');
    });
  });

  describe('closing the modal', () => {
    it('closes checkout and clears the form', () => {
      cart.openCheckout();
      component.buyerName = 'Tibor';
      component.buyerEmail = 'tibor@example.com';

      component.onClose();

      expect(cart.checkoutOpen()).toBe(false);
      expect(component.buyerName).toBe('');
      expect(component.buyerEmail).toBe('');
    });

    it('resets the placed-order state so the next checkout starts fresh', () => {
      cart.addToCart(makeListing({ quantity: 5 }));
      cart.openCheckout();
      component.onConfirm();
      expect(component.orderPlaced()).toBe(true);

      component.onClose();

      expect(component.orderPlaced()).toBe(false);
    });
  });
});
