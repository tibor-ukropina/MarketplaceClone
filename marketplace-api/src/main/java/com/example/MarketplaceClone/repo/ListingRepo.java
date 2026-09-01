package com.example.MarketplaceClone.repo;

import com.example.MarketplaceClone.model.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ListingRepo extends JpaRepository<Listing, Integer> {


    @Query("SELECT listing FROM Listing listing WHERE listing.title = ?1")
    List<Listing> findByTitle(String title);

    List<Listing> findByTitleContainingOrDescriptionContaining(String title, String description);
}
