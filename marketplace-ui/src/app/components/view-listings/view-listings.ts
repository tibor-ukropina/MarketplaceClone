import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-view-listings',
  imports: [CommonModule, RouterLink],
  templateUrl: './view-listings.html',
  styleUrl: './view-listings.scss',
})
export class ViewListings implements OnInit {
  listings: Listing[] = [];

  constructor(private listingService: ListingService) {}

  ngOnInit() {
    this.listingService.getAllListings().subscribe(data => {
      this.listings = data;
    });
  }
}
