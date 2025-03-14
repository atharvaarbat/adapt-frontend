
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckIcon, Shield, Zap } from 'lucide-react';
import { ConvoySize, AvoidArea, Priority } from '@/types';

interface ConvoyParametersProps {
  onConvoySizeSelect: (size: string) => void;
  onAreasToAvoidSelect: (areas: string[]) => void;
  onPrioritySelect: (priority: Priority) => void;
}

// Mock data for convoy sizes
const convoySizes: ConvoySize[] = [
  { id: '1', name: 'Small (1-5 vehicles)', value: 'small' },
  { id: '2', name: 'Medium (6-15 vehicles)', value: 'medium' },
  { id: '3', name: 'Large (16-30 vehicles)', value: 'large' },
  { id: '4', name: 'Extra Large (31+ vehicles)', value: 'xl' },
];

// Mock data for areas to avoid
const areasToAvoid: AvoidArea[] = [
  { id: '1', name: 'Urban Centers', value: 'urban' },
  { id: '2', name: 'Known Threat Areas', value: 'threats' },
  { id: '3', name: 'Rough Terrain', value: 'terrain' },
  { id: '4', name: 'Bridges/Tunnels', value: 'bridges' },
  { id: '5', name: 'Checkpoints', value: 'checkpoints' },
];

const ConvoyParameters: React.FC<ConvoyParametersProps> = ({
  onConvoySizeSelect,
  onAreasToAvoidSelect,
  onPrioritySelect,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    onConvoySizeSelect(value);
  };

  const handleAreaToggle = (areaValue: string) => {
    const newSelectedAreas = selectedAreas.includes(areaValue)
      ? selectedAreas.filter(area => area !== areaValue)
      : [...selectedAreas, areaValue];
    
    setSelectedAreas(newSelectedAreas);
    onAreasToAvoidSelect(newSelectedAreas);
  };

  const handlePrioritySelect = (priority: Priority) => {
    setSelectedPriority(priority);
    onPrioritySelect(priority);
  };

  return (
    <div className="w-full space-y-4 animate-fade-in">
      {/* Convoy Size Selector */}
      <div className="space-y-2">
        <Label htmlFor="convoy-size" className="text-sm font-medium text-convoy-darkGray">
          What is the convoy size?
        </Label>
        <Select onValueChange={handleSizeChange}>
          <SelectTrigger id="convoy-size" className="w-full bg-white border border-convoy-lightGray">
            <SelectValue placeholder="Select convoy size" />
          </SelectTrigger>
          <SelectContent>
            {convoySizes.map(size => (
              <SelectItem key={size.id} value={size.value}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Areas to Avoid */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-convoy-darkGray">
          Areas to avoid (select multiple if needed):
        </Label>
        <div className="flex flex-wrap gap-2">
          {areasToAvoid.map(area => (
            <Button
              key={area.id}
              type="button"
              variant="outline"
              onClick={() => handleAreaToggle(area.value)}
              className={`
                flex items-center gap-2 
                ${selectedAreas.includes(area.value) 
                  ? 'bg-convoy-blue text-white border-convoy-blue' 
                  : 'bg-white text-convoy-darkGray border-convoy-lightGray'}
                transition-colors duration-200
              `}
            >
              {selectedAreas.includes(area.value) && (
                <CheckIcon className="w-4 h-4" />
              )}
              {area.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Priority Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-convoy-darkGray">
          Choose priority:
        </Label>
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => handlePrioritySelect('speed')}
            className={`
              flex-1 flex items-center justify-center gap-2
              ${selectedPriority === 'speed' 
                ? 'bg-convoy-blue text-white' 
                : 'bg-white text-convoy-darkGray border border-convoy-lightGray'}
              hover:bg-convoy-lightBlue hover:text-white transition-colors duration-200
            `}
          >
            <Zap className="w-4 h-4" />
            Speed
          </Button>
          <Button
            type="button"
            onClick={() => handlePrioritySelect('safety')}
            className={`
              flex-1 flex items-center justify-center gap-2
              ${selectedPriority === 'safety' 
                ? 'bg-convoy-green text-white' 
                : 'bg-white text-convoy-darkGray border border-convoy-lightGray'}
              hover:bg-convoy-green hover:text-white transition-colors duration-200
            `}
          >
            <Shield className="w-4 h-4" />
            Safety
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConvoyParameters;
