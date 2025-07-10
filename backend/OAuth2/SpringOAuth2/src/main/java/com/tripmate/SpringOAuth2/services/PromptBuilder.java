package com.tripmate.SpringOAuth2.services;

import com.tripmate.SpringOAuth2.models.TripRequest;

public class PromptBuilder {
    public static String buildEnhancedPrompt(TripRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are a personalized Sri Lankan travel assistant.\n");
        prompt.append("Create a day-by-day plan ONLY for destinations in Sri Lanka.\n\n");
        prompt.append("User Request:\n");
        prompt.append("Start Location: ").append(request.getStart()).append("\n");
        prompt.append("End Location: ").append(request.getEnd()).append("\n");
        prompt.append("Number of People: ").append(request.getPeople()).append("\n");
        prompt.append("Days Planning: ").append(request.getDays()).append("\n");
        prompt.append("Expected Budget (LKR): ").append(request.getBudget()).append("\n");
        prompt.append("Notes/Preferences: ").append(request.getNotes()).append("\n\n");
        prompt.append("Suggested Places (from route):\n");
        if (request.getCustomPlaces() != null && !request.getCustomPlaces().isEmpty()) {
            for (String place : request.getCustomPlaces()) {
                prompt.append(place).append(" (tourist_attraction)\n");
            }
        } else {
            prompt.append("No specific attractions provided; suggest popular ones.\n");
        }
        prompt.append("\nRespond with the following sections in plain text, without any markdown, asterisks, bullets, or code blocks. Do not use any bullet points, asterisks, dashes, or bold/italic formatting. Each section must start with its header, followed by plain text content. For lists, simply use newlines, numbered steps, or semicolons if needed, but do not use any symbols like *, -, or .\n\n");
        prompt.append("1. DETAILED ITINERARY:\nGive the plan as simple numbered steps or time blocks. No bullets or asterisks.\n\n");
        prompt.append("2. JSON STRUCTURE:\nGive valid JSON, but do NOT wrap it in any code block or markdown. Just the JSON.\n\n");
        prompt.append("3. BUDGET BREAKDOWN:\nList costs as plain text, do not use any bullets, asterisks, or dashes.\n\n");
        prompt.append("4. RECOMMENDED PLACES:\nList places plainly, one per line, no symbols.\n\n");
        prompt.append("5. TRAVEL TIPS:\nList tips as plain text, one per line, no bullets, asterisks, or dashes.\n");
        return prompt.toString();
    }
}