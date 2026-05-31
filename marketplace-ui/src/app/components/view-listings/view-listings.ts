import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../services/listing';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-view-listings',
  imports: [RouterLink, FormsModule],
  templateUrl: './view-listings.html',
  styleUrl: './view-listings.scss',
})
export class ViewListings implements OnInit {
  listings = signal<Listing[]>([]);
  searchKeyword = '';

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    this.loadAllListings();
  }

  loadAllListings() {
    this.listingService.getAllListings().subscribe({
      next: data => this.listings.set(data),
      error: err => console.error('Error fetching listings:', err)
    });
  }

  onSearch() {
    const keyword = this.searchKeyword.trim();
    if (!keyword) {
      this.loadAllListings();
      return;
    }
    this.listingService.searchListings(keyword).subscribe({
      next: data => this.listings.set(data),
      error: err => console.error('Error searching listings:', err)
    });
  }

  onClear() {
    this.searchKeyword = '';
    this.loadAllListings();
  }
}
