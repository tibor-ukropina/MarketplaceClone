import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, switchMap, debounceTime, distinctUntilChanged, merge, of } from 'rxjs';
import { ListingService } from '../../services/listing';
import { CartService } from '../../services/cart';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-view-listings',
  imports: [RouterLink, FormsModule],
  templateUrl: './view-listings.html',
  styleUrl: './view-listings.scss',
})
export class ViewListings implements OnInit, OnDestroy {
  listings = signal<Listing[]>([]);
  searchKeyword = '';

  private searchSubject = new Subject<string>();

  constructor(private listingService: ListingService, private cart: CartService) {}

  addAmounts: { [id: number]: number } = {};

  getAmount(listing: Listing): number {
    return this.addAmounts[listing.id] ?? 1;
  }

  remaining(listing: Listing): number | null {
    if (listing.quantity == null) return null;
    return listing.quantity - this.cart.quantityInCart(listing.id);
  }

  isMaxed(listing: Listing): boolean {
    const remaining = this.remaining(listing);
    return remaining != null && remaining <= 0;
  }

  increaseAmount(listing: Listing) {
    const remaining = this.remaining(listing);
    const current = this.getAmount(listing);
    if (remaining == null || current < remaining) {
      this.addAmounts[listing.id] = current + 1;
    }
  }

  decreaseAmount(listing: Listing) {
    const current = this.getAmount(listing);
    if (current > 1) {
      this.addAmounts[listing.id] = current - 1;
    }
  }

  onAddToCart(listing: Listing) {
    this.cart.addToCart(listing, this.getAmount(listing));
    this.addAmounts[listing.id] = 1;
  }

  ngOnInit() {
    merge(
      of(''),
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged())
    ).pipe(
      switchMap(keyword =>
        keyword.trim()
          ? this.listingService.searchListings(keyword.trim())
          : this.listingService.getAllListings()
      )
    ).subscribe({
      next: data => this.listings.set(data),
      error: err => console.error('Error:', err)
    });
  }

  onSearch() {
    this.searchSubject.next(this.searchKeyword);
  }

  onClear() {
    this.searchKeyword = '';
    this.searchSubject.next('');
  }

  onDelete(listing: Listing) {
    if (!confirm(`Delete "${listing.title}"?`)) return;
    this.listingService.deleteListing(listing).subscribe({
      next: () => this.listings.update(list => list.filter(l => l.id !== listing.id)),
      error: err => console.error('Error deleting listing:', err)
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }
}
