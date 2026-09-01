package com.example.MarketplaceClone.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
@Entity
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String description;
    private double price;
    private Integer quantity;
    private List<String> categories;
    private String condition;
    private String location;

    //image
    private String imageName;
    private String imageType;
    @Column(columnDefinition = "bytea")
    private byte[] imageData;

}
