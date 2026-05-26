import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-view-listings',
  imports: [RouterLink],
  templateUrl: './view-listings.html',
  styleUrl: './view-listings.scss',
})
export class ViewListings implements OnInit {
  listings = signal<Listing[]>([]);

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    this.listingService.getAllListings().subscribe({
      next: data => {
        this.listings.set(data);
      },
      error: err => {
        console.error('Error fetching listings:', err);
      }
    });
  }
}
