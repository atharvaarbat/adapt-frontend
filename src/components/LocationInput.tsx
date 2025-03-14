
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { Location } from '@/types';

interface LocationInputProps {
  label: string;
  onLocationSubmit: (location: Location) => void;
  placeholder?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  label,
  onLocationSubmit,
  placeholder = 'Enter location or coordinates',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    setIsSubmitting(true);
    
    // In a real application, geocode the input to get coordinates
    // For this demo, we'll create a mock location
    setTimeout(() => {
      const mockLocation: Location = {
        id: Date.now().toString(),
        name: inputValue,
        coordinates: [
          -73.935242 + (Math.random() - 0.5) * 20, // Random coordinates near New York
          40.730610 + (Math.random() - 0.5) * 20,
        ],
      };
      
      onLocationSubmit(mockLocation);
      setInputValue('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2 animate-fade-in">
      <label htmlFor={`location-${label}`} className="text-sm font-medium text-convoy-darkGray">
        {label}
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id={`location-${label}`}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="pl-9 bg-white border border-convoy-lightGray focus:ring-convoy-blue focus:border-convoy-blue"
          />
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-convoy-gray w-4 h-4" />
        </div>
        <Button 
          type="submit" 
          disabled={!inputValue.trim() || isSubmitting}
          className="bg-convoy-blue hover:bg-convoy-darkBlue text-white transition-colors duration-200"
        >
          {isSubmitting ? 'Setting...' : 'Set'}
        </Button>
      </div>
    </form>
  );
};

export default LocationInput;
