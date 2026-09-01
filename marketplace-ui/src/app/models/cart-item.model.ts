import { Listing } from './listing.model';

export interface CartItem {
  listing: Listing;
  quantity: number;
}
