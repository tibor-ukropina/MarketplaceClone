package com.example.MarketplaceClone.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
public class Listing {

    private int id;
    private String title;
    private String description;
    private double price;
    private List<String> categories;
    private String condition;
    private String location;
}
