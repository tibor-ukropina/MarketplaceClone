import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ListingService } from './listing';
import { Listing } from '../models/listing.model';
import { environment } from '../../environments/environment';

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

describe('ListingService', () => {
  let service: ListingService;
  let httpMock: HttpTestingController;

  const base = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ListingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Fails the test if a request was made that no expectation matched.
    httpMock.verify();
  });

  it('gets all listings', () => {
    const listings = [makeListing({ id: 1 }), makeListing({ id: 2 })];
    let result: Listing[] | undefined;

    service.getAllListings().subscribe(data => (result = data));

    const req = httpMock.expectOne(`${base}/listings`);
    expect(req.request.method).toBe('GET');
    req.flush(listings);

    expect(result).toEqual(listings);
  });

  it('gets a single listing by id', () => {
    const listing = makeListing({ id: 42 });
    let result: Listing | undefined;

    service.getListingById(42).subscribe(data => (result = data));

    const req = httpMock.expectOne(`${base}/listings/42`);
    expect(req.request.method).toBe('GET');
    req.flush(listing);

    expect(result).toEqual(listing);
  });

  it('posts a new listing as JSON', () => {
    const listing = makeListing({ id: 0, title: 'Brand New' });

    service.addListing(listing).subscribe();

    const req = httpMock.expectOne(`${base}/listings`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(listing);
    req.flush(makeListing({ id: 5, title: 'Brand New' }));
  });

  it('searches listings by keyword', () => {
    service.searchListings('iphone').subscribe();

    const req = httpMock.expectOne(`${base}/listings/search/iphone`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('posts a listing with an image as multipart form data', () => {
    const listing = makeListing({ title: 'With Photo' });
    const image = new File(['fake-bytes'], 'photo.jpg', { type: 'image/jpeg' });

    service.addListingWithImage(listing, image).subscribe();

    const req = httpMock.expectOne(`${base}/listing`);
    expect(req.request.method).toBe('POST');

    const body = req.request.body as FormData;
    expect(body instanceof FormData).toBe(true);
    expect(body.get('listing')).toBeTruthy();
    expect(body.get('image')).toBe(image);

    req.flush(makeListing({ id: 9 }));
  });

  it('updates a listing with an image as a multipart PUT', () => {
    const listing = makeListing({ id: 3, title: 'Updated' });
    const image = new File(['fake-bytes'], 'new.jpg', { type: 'image/jpeg' });

    service.updateListing(listing, image).subscribe();

    const req = httpMock.expectOne(`${base}/listing/3`);
    expect(req.request.method).toBe('PUT');

    const body = req.request.body as FormData;
    expect(body.get('listing')).toBeTruthy();
    expect(body.get('imageFile')).toBe(image);

    req.flush('Updated');
  });

  it('updates a listing without an image when none is selected', () => {
    const listing = makeListing({ id: 3 });

    service.updateListing(listing).subscribe();

    const req = httpMock.expectOne(`${base}/listing/3`);
    const body = req.request.body as FormData;

    expect(body.get('listing')).toBeTruthy();
    expect(body.get('imageFile')).toBeNull();

    req.flush('Updated');
  });

  it('deletes a listing and sends it as the request body', () => {
    const listing = makeListing({ id: 8 });

    service.deleteListing(listing).subscribe();

    const req = httpMock.expectOne(`${base}/listings/8`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(listing);

    req.flush(null);
  });
});
