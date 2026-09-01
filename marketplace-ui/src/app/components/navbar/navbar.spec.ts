import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Navbar } from './navbar';
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

describe('Navbar', () => {
  let fixture: ComponentFixture<Navbar>;
  let component: Navbar;
  let cart: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideRouter([])]
    });

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    cart = TestBed.inject(CartService);
  });

  it('shows the navigation links', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Marketplace');
    expect(text).toContain('Browse');
    expect(text).toContain('Post a Listing');
  });

  it('hides the mini cart until the cart button is clicked', () => {
    fixture.detectChanges();

    expect(cart.cartOpen()).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Your Cart');
  });

  it('opens and closes the mini cart when toggled', () => {
    component.toggleCart();
    expect(cart.cartOpen()).toBe(true);

    component.toggleCart();
    expect(cart.cartOpen()).toBe(false);
  });

  it('shows no badge when the cart is empty', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.badge')).toBeNull();
  });

  it('shows the total number of items in the badge', () => {
    cart.addToCart(makeListing({ id: 1, quantity: 10 }), 2);
    cart.addToCart(makeListing({ id: 2, quantity: 10 }), 3);

    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge).not.toBeNull();
    expect(badge.textContent.trim()).toBe('5');
  });

  it('lists the cart contents and total when open', () => {
    cart.addToCart(makeListing({ id: 1, title: 'MacBook Pro', price: 1500, quantity: 5 }), 2);
    component.toggleCart();

    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Your Cart');
    expect(text).toContain('MacBook Pro');
    expect(text).toContain('3000');
  });

  it('tells the user when the open cart is empty', () => {
    component.toggleCart();

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Your cart is empty.');
  });
});
