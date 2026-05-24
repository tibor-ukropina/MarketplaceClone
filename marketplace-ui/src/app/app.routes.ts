import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AddListing } from './components/add-listing/add-listing';
import { ViewListings } from './components/view-listings/view-listings';
import { ListingDetail } from './components/listing-detail/listing-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'listings', component: ViewListings },
  { path: 'add', component: AddListing },
  { path: 'listing/:id', component: ListingDetail },
  { path: '**', redirectTo: '' }
];
