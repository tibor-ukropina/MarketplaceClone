import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing';
import { CartService } from '../../services/cart';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-listing-detail',
  imports: [RouterLink],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.scss',
})
export class ListingDetail implements OnInit {
  listing: Listing | null = null;

  constructor(
    private route: ActivatedRoute,
    private listingService: ListingService,
    private cart: CartService
  ) {}

  addAmount = 1;

  remaining(): number | null {
    if (!this.listing || this.listing.quantity == null) return null;
    return this.listing.quantity - this.cart.quantityInCart(this.listing.id);
  }

  isMaxed(): boolean {
    const remaining = this.remaining();
    return remaining != null && remaining <= 0;
  }

  increaseAmount() {
    const remaining = this.remaining();
    if (remaining == null || this.addAmount < remaining) {
      this.addAmount++;
    }
  }

  decreaseAmount() {
    if (this.addAmount > 1) {
      this.addAmount--;
    }
  }

  onAddToCart() {
    if (this.listing) {
      this.cart.addToCart(this.listing, this.addAmount);
      this.addAmount = 1;
    }
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listingService.getListingById(id).subscribe(data => {
      this.listing = data;
    });
  }
}
