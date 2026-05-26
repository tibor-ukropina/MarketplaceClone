package com.example.MarketplaceClone.repo;

import com.example.MarketplaceClone.model.Listing;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Repository
public class ListingRepo {

    List<Listing> listings = new ArrayList<Listing>(Arrays.asList(
        new Listing(1, "iPhone 13", "Great condition, no scratches, comes with original charger", 450.00, List.of("Electronics"), "Like New", "Chicago, IL"),
        new Listing(2, "IKEA Desk", "Large white desk, some minor scuffs on the legs", 75.00, List.of("Furniture"), "Good", "Austin, TX"),
        new Listing(3, "Mountain Bike", "Trek 820, recently tuned up, new tires", 320.00, List.of("Sports & Outdoors"), "Good", "Denver, CO")
    ));

    public List<Listing> getListings() {
        return listings;
    }

    public void addListing(Listing listing) {
        listings.add(listing);
        System.out.println(listings);
    }

    public Listing getListingById(int id) {
        return listings.stream().filter(listing -> listing.getId() == id).findFirst().orElse(null);
    }

}
