import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";

function Right({ start, end, setStart, setEnd, attractions, onReplan }) {
  const [days, setDays] = useState('');
  const [people, setPeople] = useState('');
  const [budget, setBudget] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const tokenCount = prompt.split(' ').length;

  const handleSubmit = async () => {
    if (!start || !end || !days || !people || !budget) {
      alert('Please fill all required fields and find route first');
      return;
    }

    if (attractions.length === 0) {
      alert('Please find route and attractions first by clicking "Find Route & Attractions"');
      return;
    }

    setIsLoading(true);
    setOutput(null);

    // Prepare request payload for backend
    const requestData = {
      start,
      end,
      days: parseInt(days),
      people: parseInt(people),
      budget: parseInt(budget),
      notes: prompt,
      // Send top attractions found from frontend to backend
      customPlaces: attractions.slice(0, 10).map(place => place.name)
    };

    try {
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/api/trip/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate trip plan');
      }

      const results = await response.json();
      console.log('Trip plan results:', results);
      
      // Format the response for display
      const formattedOutput = {
        plan: results.itineraryText,
        json: results.structuredPlan ? JSON.parse(results.structuredPlan) : null,
        places: results.recommendedPlaces || [],
        totalBudget: results.estimatedBudget,
        budgetBreakdown: results.budgetBreakdown
      };

      setOutput(formattedOutput);
    } catch (error) {
      console.error('Error:', error);
      setOutput({ error: 'Failed to generate trip plan. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 w-full max-w-xl space-y-4 bg-white rounded-xl shadow-lg">
      <div>
        <label className="block text-sm font-semibold">Start Location</label>
        <input 
          value={start} 
          onChange={e => setStart(e.target.value)} 
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., Kandy"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold">End Location</label>
        <input 
          value={end} 
          onChange={e => setEnd(e.target.value)} 
          className="w-full border rounded px-3 py-2"
          placeholder="e.g., Colombo"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold">Duration (Days) *</label>
        <input 
          type="number" 
          value={days} 
          onChange={e => setDays(e.target.value)} 
          className="w-full border rounded px-3 py-2"
          min="1"
          max="30"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold">Number of Travelers *</label>
        <input 
          type="number" 
          value={people} 
          onChange={e => setPeople(e.target.value)} 
          className="w-full border rounded px-3 py-2"
          min="1"
          max="20"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold">Budget (LKR) *</label>
        <input 
          type="number" 
          value={budget} 
          onChange={e => setBudget(e.target.value)} 
          className="w-full border rounded px-3 py-2"
          min="1000"
          placeholder="e.g., 50000"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold">Additional Preferences</label>
        <textarea 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          rows={4} 
          className="w-full border rounded px-3 py-2"
          placeholder="Tell us about your interests, dietary preferences, accommodation type, etc."
        />
        <p className="text-xs text-right text-gray-500">Words: {tokenCount}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onReplan}
          disabled={!start || !end}
          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          Find Route & Attractions
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading || !start || !end || !days || !people || !budget || attractions.length === 0}
          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Planning trip...' : 'Generate Plan'}
        </button>
      </div>

      {attractions.length > 0 && (
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="font-semibold text-sm mb-2">Top Attractions found along route ({attractions.length}):</h4>
          <div className="text-xs text-gray-700 max-h-32 overflow-y-auto">
            {attractions.slice(0, 10).map((place, idx) => (
              <div key={place.place_id || idx} className="mb-1">
                • {place.name} {place.rating && `⭐ ${place.rating}`}
              </div>
            ))}
            {attractions.length > 10 && <div className="text-gray-500 italic">... and {attractions.length - 10} more will be considered</div>}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center text-blue-500 animate-pulse">
          🤖 AI is planning your perfect Sri Lankan adventure...
        </div>
      )}

      {output && (
        <div className="mt-4 border-t pt-4 space-y-2">
          <h3 className="text-lg font-bold">Your Trip Plan</h3>
          {output.error ? (
            <p className="text-red-500">{output.error}</p>
          ) : (
            <>
              <div className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                {output.plan}
              </div>
              
              {output.json && (
                <div>
                  <h4 className="font-semibold">Structured Plan</h4>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-32">
                    {JSON.stringify(output.json, null, 2)}
                  </pre>
                </div>
              )}
              
              {output.places && output.places.length > 0 && (
                <div>
                  <h4 className="font-semibold">Recommended Places</h4>
                  <ul className="list-disc list-inside text-sm">
                    {output.places.map((place, index) => (
                      <li key={index}>{place}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {output.totalBudget && (
                <div>
                  <p className="text-sm font-medium text-green-700">
                    💰 Estimated Total Budget: LKR {output.totalBudget} for {people} people
                  </p>
                  
                  {output.budgetBreakdown && (
                    <div className="mt-2 text-xs">
                      <strong>Budget Breakdown:</strong>
                      <ul className="list-disc list-inside ml-4">
                        {Object.entries(output.budgetBreakdown).map(([key, value]) => (
                          <li key={key}>{key}: LKR {value}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Right;