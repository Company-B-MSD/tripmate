package com.tripmate.SpringOAuth2.services;

import java.util.HashMap;
import java.util.Map;

public class BudgetCalculator {
    public static Map<String, Double> calculate(int people, int days) {
        Map<String, Double> breakdown = new HashMap<>();
        double lodging = 6000 * people * days;
        double food = 2000 * people * days;
        double transport = 10000;
        double entryFees = 1000 * people * days;
        double misc = 3000;
        breakdown.put("Lodging", lodging);
        breakdown.put("Food", food);
        breakdown.put("Transport", transport);
        breakdown.put("Entry Fees", entryFees);
        breakdown.put("Miscellaneous", misc);
        double total = lodging + food + transport + entryFees + misc;
        breakdown.put("Total", total);
        return breakdown;
    }
}