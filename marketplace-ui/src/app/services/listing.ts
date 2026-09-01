import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Listing } from '../models/listing.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = `${environment.apiUrl}/listings`;

  constructor(private http: HttpClient) {}

  getAllListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.apiUrl);
  }

  getListingById(id: number): Observable<Listing> {
    return this.http.get<Listing>(`${this.apiUrl}/${id}`);
  }

  addListing(listing: Listing): Observable<Listing> {
    return this.http.post<Listing>(this.apiUrl, listing);
  }

  searchListings(keyword: string): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.apiUrl}/search/${keyword}`);
  }

  addListingWithImage(listing: Listing, image: File): Observable<Listing> {
    const formData = new FormData();
    formData.append('listing', new Blob([JSON.stringify(listing)], { type: 'application/json' }));
    formData.append('image', image);
    return this.http.post<Listing>(`${environment.apiUrl}/listing`, formData);
  }

  updateListing(listing: Listing, image?: File): Observable<string> {
    const formData = new FormData();
    formData.append('listing', new Blob([JSON.stringify(listing)], { type: 'application/json' }));
    if (image) {
      formData.append('imageFile', image);
    }
    return this.http.put(`${environment.apiUrl}/listing/${listing.id}`, formData, { responseType: 'text' });
  }

  deleteListing(listing: Listing): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${listing.id}`, { body: listing });
  }
}
