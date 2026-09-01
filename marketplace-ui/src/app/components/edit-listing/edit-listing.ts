import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingService } from '../../services/listing';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-edit-listing',
  imports: [FormsModule, RouterLink],
  templateUrl: './edit-listing.html',
  styleUrl: './edit-listing.scss',
})
export class EditListing implements OnInit {
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

  constructor(
    private listingService: ListingService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.listingService.getListingById(id).subscribe({
      next: data => {
        this.listing = data;
        if (data.imageData) {
          this.imagePreview = `data:${data.imageType};base64,${data.imageData}`;
        }
        this.cdr.detectChanges();
      },
      error: err => console.error('Error fetching listing:', err)
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImage = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  onSubmit() {
    this.listingService.updateListing(this.listing, this.selectedImage ?? undefined).subscribe({
      next: () => this.router.navigate(['/listings']),
      error: err => console.error('Error updating listing:', err)
    });
  }
}
