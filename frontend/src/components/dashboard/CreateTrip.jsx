import React, { useState } from 'react';
import { DatePicker } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateTrip = () => {
  const navigate = useNavigate();
  const [stops, setStops] = useState(['']);
  const [travelers, setTravelers] = useState(1);
  const [budget, setBudget] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState('');
  const [startingLocation, setStartingLocation] = useState('');
  const [finalDestination, setFinalDestination] = useState('');

  const addStop = () => {
    setStops([...stops, '']);
  };

  const removeStop = (index) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops);
  };

  const updateStop = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date && !date.isBefore(endDate)) {
      setDateError('End date must be after start date');
    } else {
      setDateError('');
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date && !date.isAfter(startDate)) {
      setDateError('End date must be after start date');
    } else {
      setDateError('');
    }
  };

  const handleSaveTrip = () => {
    if (startDate && endDate && !endDate.isAfter(startDate)) {
      setDateError('End date must be after start date');
      return;
    }

    const tripData = {
      startingLocation,
      stops: stops.filter(stop => stop.trim() !== ''),
      finalDestination,
      travelers,
      budget,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null
    };

    console.log('Saving trip data:', tripData);

    setStartingLocation('');
    setStops(['']);
    setFinalDestination('');
    setTravelers(1);
    setStartDate(null);
    setEndDate(null);
    setDateError('');

    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-0">
      <Card className="max-w-3xl mx-auto shadow-lg bg-card">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold text-primary">Create a New Trip</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Starting Location */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Starting Location
              </label>
              <Input
                type="text"
                placeholder="Enter your starting point"
                value={startingLocation}
                onChange={(e) => setStartingLocation(e.target.value)}
              />
            </div>

            {/* Stops Along the Way */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stops Along the Way
              </label>
              {stops.map((stop, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder={`Enter stop ${index + 1} (optional)`}
                    value={stop}
                    onChange={(e) => updateStop(index, e.target.value)}
                    className="flex-1"
                  />
                  {index > 0 && (
                    <Button
                      onClick={() => removeStop(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button onClick={addStop} variant="outline" className="mt-2">
                <PlusOutlined className="mr-2" /> Add Another Stop
              </Button>
            </div>

            {/* Final Destination */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Final Destination
              </label>
              <Input
                type="text"
                placeholder="Enter your destination"
                value={finalDestination}
                onChange={(e) => setFinalDestination(e.target.value)}
              />
            </div>

            {/* Number of Travelers */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Number of Travelers
              </label>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  variant="outline"
                  size="icon"
                >
                  <MinusOutlined />
                </Button>
                <Input
                  type="number"
                  value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                  min="1"
                />
                <Button
                  onClick={() => setTravelers(travelers + 1)}
                  variant="outline"
                  size="icon"
                >
                  <PlusOutlined />
                </Button>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Date
              </label>
              <DatePicker
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full !border-input !rounded-md !bg-background hover:!border-[#FFD700]/70 focus:!border-[#FFD700]/70 focus:!ring-2 focus:!ring-[#FFD700]/70 [&_.ant-picker-input>input]:text-[#FFD700]/70 [&_.ant-picker-input>input::placeholder]:text-[#FFD700]/70 [&_.ant-picker-suffix]:text-[#FFD700]/70"
                placeholder="Select start date"
                suffixIcon={<span className="text-[#FFD700]/10 text-lg">📅</span>}
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Date
              </label>
              <DatePicker
                value={endDate}
                onChange={handleEndDateChange}
                className="w-full !border-input !rounded-md !bg-background hover:!border-[#FFD700]/70 focus:!border-[#FFD700]/70 focus:!ring-2 focus:!ring-[#FFD700]/70 [&_.ant-picker-input>input]:text-[#FFD700]/70 [&_.ant-picker-input>input::placeholder]:text-[#FFD700]/70 [&_.ant-picker-suffix]:text-[#FFD700]/70"
                placeholder="Select end date"
                suffixIcon={<span className="text-[#FFD700]/10 text-lg">📅</span>}
              />
              {dateError && (
                <p className="text-red-500 text-sm mt-1">{dateError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                onClick={handleSaveTrip}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Create Trip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTrip; 