import { TestBed } from '@angular/core/testing';
import { CartService } from './cart';
import { Listing } from '../models/listing.model';

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

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('starts with an empty cart', () => {
    expect(service.items()).toEqual([]);
    expect(service.count()).toBe(0);
    expect(service.total()).toBe(0);
  });

  describe('addToCart', () => {
    it('adds a listing with a quantity of 1 by default', () => {
      service.addToCart(makeListing());

      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(1);
    });

    it('adds a specific amount when one is given', () => {
      service.addToCart(makeListing({ quantity: 10 }), 4);

      expect(service.items()[0].quantity).toBe(4);
    });

    it('increases the quantity when the same listing is added again', () => {
      const listing = makeListing({ quantity: 10 });

      service.addToCart(listing, 2);
      service.addToCart(listing, 3);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].quantity).toBe(5);
    });

    it('keeps different listings as separate cart entries', () => {
      service.addToCart(makeListing({ id: 1 }));
      service.addToCart(makeListing({ id: 2 }));

      expect(service.items().length).toBe(2);
    });

    it('caps the amount at the quantity available on the listing', () => {
      service.addToCart(makeListing({ quantity: 3 }), 10);

      expect(service.items()[0].quantity).toBe(3);
    });

    it('caps at the available quantity when topping up an existing item', () => {
      const listing = makeListing({ quantity: 5 });

      service.addToCart(listing, 4);
      service.addToCart(listing, 4);

      expect(service.items()[0].quantity).toBe(5);
    });

    it('treats a listing with no quantity set as unlimited', () => {
      service.addToCart(makeListing({ quantity: undefined }), 99);

      expect(service.items()[0].quantity).toBe(99);
    });
  });

  describe('count and total', () => {
    it('counts every unit across all cart items', () => {
      service.addToCart(makeListing({ id: 1, quantity: 10 }), 2);
      service.addToCart(makeListing({ id: 2, quantity: 10 }), 3);

      expect(service.count()).toBe(5);
    });

    it('multiplies price by quantity for the total', () => {
      service.addToCart(makeListing({ id: 1, price: 1500, quantity: 10 }), 2);
      service.addToCart(makeListing({ id: 2, price: 250, quantity: 10 }), 1);

      expect(service.total()).toBe(3250);
    });

    it('recalculates the total when a quantity changes', () => {
      const listing = makeListing({ price: 100, quantity: 10 });
      service.addToCart(listing, 2);
      expect(service.total()).toBe(200);

      service.increment(listing.id);

      expect(service.total()).toBe(300);
    });
  });

  describe('increment and decrement', () => {
    it('increments the quantity of an item', () => {
      const listing = makeListing({ quantity: 10 });
      service.addToCart(listing);

      service.increment(listing.id);

      expect(service.items()[0].quantity).toBe(2);
    });

    it('will not increment past the available quantity', () => {
      const listing = makeListing({ quantity: 2 });
      service.addToCart(listing, 2);

      service.increment(listing.id);

      expect(service.items()[0].quantity).toBe(2);
    });

    it('decrements the quantity of an item', () => {
      const listing = makeListing({ quantity: 10 });
      service.addToCart(listing, 3);

      service.decrement(listing.id);

      expect(service.items()[0].quantity).toBe(2);
    });

    it('removes the item entirely when decremented to zero', () => {
      const listing = makeListing();
      service.addToCart(listing);

      service.decrement(listing.id);

      expect(service.items()).toEqual([]);
    });

    it('leaves other items untouched when one is changed', () => {
      service.addToCart(makeListing({ id: 1, quantity: 10 }));
      service.addToCart(makeListing({ id: 2, quantity: 10 }));

      service.increment(1);

      expect(service.quantityInCart(1)).toBe(2);
      expect(service.quantityInCart(2)).toBe(1);
    });
  });

  describe('quantityInCart', () => {
    it('returns 0 for a listing that is not in the cart', () => {
      expect(service.quantityInCart(999)).toBe(0);
    });

    it('returns the quantity for a listing that is in the cart', () => {
      service.addToCart(makeListing({ id: 7, quantity: 10 }), 3);

      expect(service.quantityInCart(7)).toBe(3);
    });
  });

  describe('removeFromCart and clearCart', () => {
    it('removes only the listing it was given', () => {
      service.addToCart(makeListing({ id: 1 }));
      service.addToCart(makeListing({ id: 2 }));

      service.removeFromCart(1);

      expect(service.items().length).toBe(1);
      expect(service.items()[0].listing.id).toBe(2);
    });

    it('empties the cart entirely', () => {
      service.addToCart(makeListing({ id: 1 }));
      service.addToCart(makeListing({ id: 2 }));

      service.clearCart();

      expect(service.items()).toEqual([]);
      expect(service.count()).toBe(0);
      expect(service.total()).toBe(0);
    });
  });

  describe('cart and checkout visibility', () => {
    it('starts with both the mini cart and checkout closed', () => {
      expect(service.cartOpen()).toBe(false);
      expect(service.checkoutOpen()).toBe(false);
    });

    it('closes the mini cart and opens checkout together', () => {
      service.cartOpen.set(true);

      service.openCheckout();

      expect(service.cartOpen()).toBe(false);
      expect(service.checkoutOpen()).toBe(true);
    });
  });
});
