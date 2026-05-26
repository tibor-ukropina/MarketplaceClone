package com.example.MarketplaceClone;

import com.example.MarketplaceClone.model.Listing;
import com.example.MarketplaceClone.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class ListingController {

    @Autowired
    private ListingService service;


    @PostMapping("/api/listings")
    public Listing addListing(@RequestBody Listing listing) {
        service.addListing(listing);
        return listing;
    }

    @GetMapping("/api/listings/{id}")
    public Listing getListingById(@PathVariable int id) {

        return service.getListingById(id);

    }

    @GetMapping("/api/listings")
    public List<Listing> browseListings() {
        return service.viewListings();
    }
}
