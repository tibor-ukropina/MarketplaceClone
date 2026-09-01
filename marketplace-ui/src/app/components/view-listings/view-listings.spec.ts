import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ViewListings } from './view-listings';
import { CartService } from '../../services/cart';
import { Listing } from '../../models/listing.model';
import { environment } from '../../../environments/environment';

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

describe('ViewListings', () => {
  let fixture: ComponentFixture<ViewListings>;
  let component: ViewListings;
  let httpMock: HttpTestingController;
  let cart: CartService;

  const base = environment.apiUrl;

  const initialListings = [
    makeListing({ id: 1, title: 'MacBook Pro', price: 1500, quantity: 3 }),
    makeListing({ id: 2, title: 'Z-Fold', price: 2250, quantity: 6 }),
    makeListing({ id: 3, title: 'Vintage Lamp', price: 40, quantity: undefined })
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewListings],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });

    fixture = TestBed.createComponent(ViewListings);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    cart = TestBed.inject(CartService);

    // ngOnInit immediately loads all listings.
    fixture.detectChanges();
    httpMock.expectOne(`${base}/listings`).flush(initialListings);
  });

  it('loads all listings on init', () => {
    expect(component.listings().length).toBe(3);
    expect(component.listings()[0].title).toBe('MacBook Pro');
  });

  describe('the add-to-cart amount picker', () => {
    it('starts at 1 for every listing', () => {
      expect(component.getAmount(initialListings[0])).toBe(1);
    });

    it('increases the amount', () => {
      const listing = initialListings[0];

      component.increaseAmount(listing);
      component.increaseAmount(listing);

      expect(component.getAmount(listing)).toBe(3);
    });

    it('will not increase past the quantity available', () => {
      const listing = initialListings[0]; // quantity 3

      component.increaseAmount(listing);
      component.increaseAmount(listing);
      component.increaseAmount(listing);
      component.increaseAmount(listing);

      expect(component.getAmount(listing)).toBe(3);
    });

    it('will not decrease below 1', () => {
      const listing = initialListings[0];

      component.decreaseAmount(listing);
      component.decreaseAmount(listing);

      expect(component.getAmount(listing)).toBe(1);
    });

    it('tracks amounts per listing independently', () => {
      component.increaseAmount(initialListings[0]);

      expect(component.getAmount(initialListings[0])).toBe(2);
      expect(component.getAmount(initialListings[1])).toBe(1);
    });

    it('lets the amount climb freely when the listing has no quantity set', () => {
      const unlimited = initialListings[2];

      for (let i = 0; i < 20; i++) {
        component.increaseAmount(unlimited);
      }

      expect(component.getAmount(unlimited)).toBe(21);
    });
  });

  describe('remaining and isMaxed', () => {
    it('reports the full quantity as remaining when the cart is empty', () => {
      expect(component.remaining(initialListings[0])).toBe(3);
      expect(component.isMaxed(initialListings[0])).toBe(false);
    });

    it('subtracts what is already in the cart', () => {
      cart.addToCart(initialListings[0], 2);

      expect(component.remaining(initialListings[0])).toBe(1);
      expect(component.isMaxed(initialListings[0])).toBe(false);
    });

    it('is maxed once the cart holds everything available', () => {
      cart.addToCart(initialListings[0], 3);

      expect(component.remaining(initialListings[0])).toBe(0);
      expect(component.isMaxed(initialListings[0])).toBe(true);
    });

    it('reports null remaining and never maxes out with no quantity set', () => {
      const unlimited = initialListings[2];
      cart.addToCart(unlimited, 50);

      expect(component.remaining(unlimited)).toBeNull();
      expect(component.isMaxed(unlimited)).toBe(false);
    });

    it('treats a sold out listing as maxed', () => {
      const soldOut = makeListing({ id: 99, quantity: 0 });

      expect(component.isMaxed(soldOut)).toBe(true);
    });
  });

  describe('onAddToCart', () => {
    it('adds the picked amount to the cart', () => {
      const listing = initialListings[1];
      component.increaseAmount(listing);
      component.increaseAmount(listing);

      component.onAddToCart(listing);

      expect(cart.quantityInCart(listing.id)).toBe(3);
    });

    it('resets the picker back to 1 afterwards', () => {
      const listing = initialListings[1];
      component.increaseAmount(listing);

      component.onAddToCart(listing);

      expect(component.getAmount(listing)).toBe(1);
    });
  });

  describe('search', () => {
    // The search pipeline debounces by 300ms, so these tests drive the clock
    // by hand instead of waiting in real time.
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('calls the search endpoint after the debounce window', () => {
      component.searchKeyword = 'macbook';
      component.onSearch();

      vi.advanceTimersByTime(300);

      const req = httpMock.expectOne(`${base}/listings/search/macbook`);
      req.flush([initialListings[0]]);

      expect(component.listings().length).toBe(1);
      expect(component.listings()[0].title).toBe('MacBook Pro');
    });

    it('does not fire a request before the debounce window elapses', () => {
      component.searchKeyword = 'mac';
      component.onSearch();

      vi.advanceTimersByTime(100);
      httpMock.expectNone(`${base}/listings/search/mac`);

      vi.advanceTimersByTime(200);
      httpMock.expectOne(`${base}/listings/search/mac`).flush([]);
    });

    it('only sends the final keyword when typing quickly', () => {
      component.searchKeyword = 'm';
      component.onSearch();
      vi.advanceTimersByTime(100);

      component.searchKeyword = 'mac';
      component.onSearch();
      vi.advanceTimersByTime(100);

      component.searchKeyword = 'macbook';
      component.onSearch();
      vi.advanceTimersByTime(300);

      httpMock.expectNone(`${base}/listings/search/m`);
      httpMock.expectNone(`${base}/listings/search/mac`);
      httpMock.expectOne(`${base}/listings/search/macbook`).flush([]);
    });

    it('reloads all listings when the search is cleared', () => {
      component.searchKeyword = 'macbook';
      component.onSearch();
      vi.advanceTimersByTime(300);
      httpMock.expectOne(`${base}/listings/search/macbook`).flush([initialListings[0]]);

      component.onClear();
      vi.advanceTimersByTime(300);

      expect(component.searchKeyword).toBe('');
      httpMock.expectOne(`${base}/listings`).flush(initialListings);
      expect(component.listings().length).toBe(3);
    });
  });

  describe('onDelete', () => {
    it('removes the listing from the page when confirmed', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const listing = initialListings[0];

      component.onDelete(listing);
      httpMock.expectOne(`${base}/listings/${listing.id}`).flush(null);

      expect(component.listings().length).toBe(2);
      expect(component.listings().some(l => l.id === listing.id)).toBe(false);
    });

    it('does nothing when the confirm dialog is cancelled', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      component.onDelete(initialListings[0]);

      httpMock.expectNone(`${base}/listings/${initialListings[0].id}`);
      expect(component.listings().length).toBe(3);
    });
  });
});
