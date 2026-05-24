import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-listing-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './listing-detail.html',
  styleUrl: './listing-detail.scss',
})
export class ListingDetail implements OnInit {
  listing: Listing | null = null;

  constructor(private route: ActivatedRoute, private listingService: ListingService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listingService.getListingById(id).subscribe(data => {
      this.listing = data;
    });
  }
}
