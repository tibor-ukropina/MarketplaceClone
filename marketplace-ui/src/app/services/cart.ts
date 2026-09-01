import { Injectable, signal, computed } from '@angular/core';
import { Listing } from '../models/listing.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>([]);
  cartOpen = signal(false);
  checkoutOpen = signal(false);

  count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  total = computed(() => this.items().reduce((sum, item) => sum + item.listing.price * item.quantity, 0));

  addToCart(listing: Listing, amount: number = 1) {
    this.items.update(items => {
      const existing = items.find(i => i.listing.id === listing.id);
      if (existing) {
        return items.map(i =>
          i.listing.id === listing.id
            ? { ...i, quantity: this.capQuantity(i.listing, i.quantity + amount) }
            : i
        );
      }
      return [...items, { listing, quantity: this.capQuantity(listing, amount) }];
    });
  }

  quantityInCart(listingId: number): number {
    const item = this.items().find(i => i.listing.id === listingId);
    return item ? item.quantity : 0;
  }

  increment(listingId: number) {
    this.items.update(items =>
      items.map(i =>
        i.listing.id === listingId
          ? { ...i, quantity: this.capQuantity(i.listing, i.quantity + 1) }
          : i
      )
    );
  }

  decrement(listingId: number) {
    this.items.update(items =>
      items
        .map(i => (i.listing.id === listingId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );
  }

  removeFromCart(listingId: number) {
    this.items.update(items => items.filter(i => i.listing.id !== listingId));
  }

  clearCart() {
    this.items.set([]);
  }

  openCheckout() {
    this.cartOpen.set(false);
    this.checkoutOpen.set(true);
  }

  private capQuantity(listing: Listing, quantity: number): number {
    if (listing.quantity != null) {
      return Math.min(quantity, listing.quantity);
    }
    return quantity;
  }
}
