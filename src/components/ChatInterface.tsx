
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Message, Location, Priority } from '@/types';
import LocationInput from './LocationInput';
import ConvoyParameters from './ConvoyParameters';
import RouteDisplay from './RouteDisplay';

interface ChatInterfaceProps {
  onLocationSubmit: (point: string, location: Location) => void;
  onConvoySizeSelect: (size: string) => void;
  onAreasToAvoidSelect: (areas: string[]) => void;
  onPrioritySelect: (priority: Priority) => void;
  onRouteSelect: (routeId: string) => void;
  routes: any[];
  selectedRouteId?: string;
  pointA: Location | null;
  pointB: Location | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onLocationSubmit,
  onConvoySizeSelect,
  onAreasToAvoidSelect,
  onPrioritySelect,
  onRouteSelect,
  routes,
  selectedRouteId,
  pointA,
  pointB,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to ConvoyPlanner! Let\'s begin by setting your start and destination points.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showPointA, setShowPointA] = useState(true);
  const [showPointB, setShowPointB] = useState(false);
  const [showConvoyParameters, setShowConvoyParameters] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle user message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I've received your message. What else can I help you with?",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  // Handle location input
  const handleLocationSubmit = (point: string, location: Location) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Set ${point} to: ${location.name}`,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      if (point === 'Point A') {
        aiResponse = `Start point set to ${location.name}. Now, let's set your destination.`;
        setShowPointA(false);
        setShowPointB(true);
      } else if (point === 'Point B') {
        aiResponse = `Destination set to ${location.name}. Great! Now let's configure your convoy parameters.`;
        setShowPointB(false);
        setShowConvoyParameters(true);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      onLocationSubmit(point, location);
    }, 1000);
  };

  // Handle convoy size selection
  const handleConvoySizeSelect = (size: string) => {
    onConvoySizeSelect(size);
  };

  // Handle areas to avoid selection
  const handleAreasToAvoidSelect = (areas: string[]) => {
    onAreasToAvoidSelect(areas);
  };

  // Handle priority selection
  const handlePrioritySelect = (priority: Priority) => {
    onPrioritySelect(priority);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: `Priority set to: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate route calculation
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "Calculating optimal routes based on your parameters...",
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
    // After a short delay, show the routes
    setTimeout(() => {
      setShowConvoyParameters(false);
      setShowRoutes(true);
      
      const routesMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "I've found several routes for your convoy. The recommended route is highlighted in blue.",
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, routesMessage]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden border border-convoy-lightGray">
      {/* Chat Header */}
      <div className="p-4 border-b border-convoy-lightGray bg-white">
        <h2 className="text-lg font-semibold text-convoy-darkBlue">Convoy Planner</h2>
        <p className="text-sm text-convoy-gray">Interactive route planning assistant</p>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`
                  max-w-[80%] p-3 rounded-lg
                  ${message.sender === 'ai' 
                    ? 'bg-convoy-lightGray text-convoy-darkGray chat-bubble-ai' 
                    : 'bg-convoy-blue text-white chat-bubble-user'}
                `}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {/* Location Input Components */}
          {showPointA && (
            <div className="flex justify-start">
              <div className="max-w-[90%] p-3 rounded-lg bg-white border border-convoy-lightGray">
                <LocationInput 
                  label="Point A"
                  placeholder="Enter start location"
                  onLocationSubmit={(location) => handleLocationSubmit('Point A', location)}
                />
              </div>
            </div>
          )}
          
          {showPointB && (
            <div className="flex justify-start">
              <div className="max-w-[90%] p-3 rounded-lg bg-white border border-convoy-lightGray">
                <LocationInput 
                  label="Point B"
                  placeholder="Enter destination"
                  onLocationSubmit={(location) => handleLocationSubmit('Point B', location)}
                />
              </div>
            </div>
          )}
          
          {/* Convoy Parameters Component */}
          {showConvoyParameters && (
            <div className="flex justify-start">
              <div className="max-w-[90%] p-3 rounded-lg bg-white border border-convoy-lightGray">
                <ConvoyParameters 
                  onConvoySizeSelect={handleConvoySizeSelect}
                  onAreasToAvoidSelect={handleAreasToAvoidSelect}
                  onPrioritySelect={handlePrioritySelect}
                />
              </div>
            </div>
          )}
          
          {/* Routes Display */}
          {showRoutes && routes.length > 0 && (
            <div className="flex justify-start">
              <div className="max-w-[90%] p-3 rounded-lg bg-white border border-convoy-lightGray">
                <RouteDisplay 
                  routes={routes}
                  onRouteSelect={onRouteSelect}
                  selectedRouteId={selectedRouteId}
                />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t border-convoy-lightGray bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-convoy-lightGray border-0 focus:ring-convoy-blue"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim()}
            className="bg-convoy-blue hover:bg-convoy-darkBlue text-white transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
