package com.example.MarketplaceClone.service;

import com.example.MarketplaceClone.model.Listing;
import com.example.MarketplaceClone.repo.ListingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListingService {

    @Autowired
    private ListingRepo repo;

    public void addListing(Listing listing) {
        repo.addListing(listing);
    }

    public List<Listing> viewListings() {
        return repo.getListings();
    }

    public Listing getListingById(int id) {
        return repo.getListingById(id);
    }
}
