package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.models.Trip;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class TripService {
    private final List<Trip> trips = new CopyOnWriteArrayList<>();

    public Trip saveTrip(Trip trip) {
        // Generate an ID or any other processing
        if (trip.getId() == null) {
            trip.setId(Long.valueOf(trips.size()));
        }
        trips.add(trip);
        return trip;
    }

    public List<Trip> getAllTrips() {
        return new ArrayList<>(trips);
    }

    public Trip getTripByIndex(int index) {
        if (index < 0 || index >= trips.size()) {
            return null;
        }
        return trips.get(index);
    }
}