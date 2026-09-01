package com.example.MarketplaceClone;

import com.example.MarketplaceClone.model.Listing;
import com.example.MarketplaceClone.service.ListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE,
RequestMethod.PUT, RequestMethod.OPTIONS})
public class ListingController {

    @Autowired
    private ListingService service;


    @PostMapping("/api/listings")
    public Listing addListing(@RequestBody Listing listing) {
        service.addListing(listing);
        return listing;
    }

    @GetMapping("/api/listings/{id}")
    public Optional<Listing> getListingById(@PathVariable int id) {
        return service.getListingById(id);
    }


    @GetMapping("/api/listings")
    public List<Listing> viewListings(@RequestParam(required = false) String title) {
        if (title != null) {return service.getListingByTitle(title);}
        return service.viewListings();
    }

    @PutMapping("/api/listing/{id}")
    public ResponseEntity<String> updateListing(@PathVariable int id,
                                           @RequestPart Listing listing,
                                           @RequestPart(required = false) MultipartFile imageFile) {
        Listing updatedListing = null;
        try{
            updatedListing = service.updateListing(listing, imageFile);
            return new ResponseEntity<>("Updated", HttpStatus.OK);
        }
        catch(IOException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @DeleteMapping("api/listings/{id}")
    public void deleteListing(@RequestBody Listing listing, @PathVariable int id){
        if (listing == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Listing cannot be null");
        }
        service.deleteListing(listing);
    }

    @GetMapping("/api/listings/search/{identifier}")
    public List<Listing> searchListingsByTitle(@PathVariable String identifier) {
        return service.searchListings(identifier, identifier);
    }

    @PostMapping("/api/listing")
    public ResponseEntity<?> addListingImage(@RequestPart Listing listing, @RequestPart MultipartFile image){
        Listing savedListing = null;
        try {
            savedListing = service.addListingImage(listing, image);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(savedListing, HttpStatus.CREATED);
    }
}
