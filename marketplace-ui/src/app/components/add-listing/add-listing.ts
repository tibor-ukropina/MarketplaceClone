import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingService } from '../../services/listing';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-add-listing',
  imports: [FormsModule],
  templateUrl: './add-listing.html',
  styleUrl: './add-listing.scss',
})
export class AddListing {
  listing: Listing = {
    id: 0,
    title: '',
    description: '',
    price: 0,
    categories: [],
    condition: '',
    location: ''
  };

  constructor(private listingService: ListingService, private router: Router) {}

  onSubmit() {
    this.listingService.addListing(this.listing).subscribe(saved => {
      this.router.navigate(['/listing', saved.id]);
    });
  }
}
