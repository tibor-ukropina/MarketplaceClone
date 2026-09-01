package com.example.MarketplaceClone.service;

import com.example.MarketplaceClone.model.Listing;
import com.example.MarketplaceClone.repo.ListingRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ListingService {

    @Autowired
    private ListingRepo repo;

    public void addListing(Listing listing) {
        repo.save(listing);
    }

    public List<Listing> viewListings() {
        return repo.findAll();
    }

    public Optional<Listing> getListingById(int id) {
        if (repo.findById(id) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found");
        }
        return repo.findById(id);
    }

    public Listing updateListing(Listing listing, MultipartFile imageFile) throws IOException {

        if(imageFile != null && !imageFile.isEmpty()){
            listing.setImageName(imageFile.getOriginalFilename());
            listing.setImageType(imageFile.getContentType());
            listing.setImageData(imageFile.getBytes());
        }

        return repo.save(listing);

    }

    public void deleteListing(Listing listing) {
        if (listing == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Listing cannot be null");
        }
        repo.delete(listing);
    }

    public List<Listing> getListingByTitle(String title) {
        return repo.findByTitle(title);
    }

    public List<Listing> searchListings(String title, String description) {
        return repo.findByTitleContainingOrDescriptionContaining(title, description);
    }

    public Listing addListingImage(Listing listing, MultipartFile image) throws IOException {

        listing.setImageName(image.getOriginalFilename());
        listing.setImageType(image.getContentType());
        listing.setImageData(image.getBytes());
        return repo.save(listing);
    }
}
