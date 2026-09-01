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
    location: '',
    quantity: 1
  };

  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(private listingService: ListingService, private router: Router) {}

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onSubmit() {
    if (this.selectedImage) {
      this.listingService.addListingWithImage(this.listing, this.selectedImage).subscribe({
        next: saved => this.router.navigate(['/listing', saved.id]),
        error: err => console.error('Error posting listing:', err)
      });
    } else {
      this.listingService.addListing(this.listing).subscribe({
        next: saved => this.router.navigate(['/listing', saved.id]),
        error: err => console.error('Error posting listing:', err)
      });
    }
  }
}
