import React, { useState, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import LocationSelector from './components/LocationSelector';
import SliderInput from './components/SliderInput';
import RouteViewer from './components/RouteViewer';
import ChatInput from './components/ChatInput';
import { processNavigationCommand } from './services/aiService';
// Mock data for locations
const LOCATIONS = [
  { "id": 1, "name": "Village A" },
  { "id": 2, "name": "City B" },
  { "id": 3, "name": "Bridge C" },
  { "id": 4, "name": "Village D" },
  { "id": 5, "name": "City E" },
  { "id": 6, "name": "Bridge F" },
  { "id": 7, "name": "Village G" },
  { "id": 8, "name": "City H" },
  { "id": 9, "name": "Bridge I" },
  { "id": 10, "name": "Village J" },
  { "id": 11, "name": "City K" },
  { "id": 12, "name": "Bridge L" },
  { "id": 13, "name": "Village M" },
  { "id": 14, "name": "City N" },
  { "id": 15, "name": "Bridge O" },
  { "id": 16, "name": "Village P" },
  { "id": 17, "name": "City Q" },
  { "id": 18, "name": "Bridge R" },
  { "id": 19, "name": "Village S" },
  { "id": 20, "name": "City T" }
];

function App() {
  // State for user inputs
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [riskLevel, setRiskLevel] = useState(2);
  const [terrainDifficulty, setTerrainDifficulty] = useState(5);
  const [removeLocations, setRemoveLocations] = useState([]);
  // State for chat and routes
  const [messages, setMessages] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [isInitialQuestionsComplete, setIsInitialQuestionsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initial system message
  useEffect(() => {
    setMessages([{
      id: 1,
      text: "Welcome to the Navigation Assistant. Please answer the following questions to get started.",
      sender: 'system'
    }]);
  }, []);

  // Check if initial questions are complete
  useEffect(() => {
    if (startLocation && endLocation && !isInitialQuestionsComplete) {
      const initialQuestions = [
        { id: 2, text: `Start location: ${startLocation.name}`, sender: 'user' },
        { id: 3, text: `End location: ${endLocation.name}`, sender: 'user' },
        { id: 4, text: `Risk level: ${riskLevel}`, sender: 'user' },
        { id: 5, text: `Terrain difficulty: ${terrainDifficulty}`, sender: 'user' },
      ];

      setMessages(prev => [...prev, ...initialQuestions]);
      setIsInitialQuestionsComplete(true);
      calculateInitialRoute();
    }
  }, [startLocation, endLocation, riskLevel, terrainDifficulty, isInitialQuestionsComplete]);

  // Mock API call to backend for route calculation
  const calculateRoute = async (requestData) => {
    setIsLoading(true);
    // console.log(requestData);
    try {
      const response = await fetch('http://127.0.0.1:5000/find_route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRouteData(data);
      // ... rest of your success handling
    } catch (error) {
      console.error('Error:', error);
      // ... error handling
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate initial route after questions are answered
  const calculateInitialRoute = () => {
    const requestData = {
      start: startLocation.id,
      end: endLocation.id,
      remove_array: [],
      terrain_difficulty: terrainDifficulty * 10 // Scale 0-10 to 0-100
    };
    calculateRoute(requestData);
  };

  // Mock API call to AI service
  const callAIService = async (userMessage) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/ai-process', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message: userMessage,
      //     currentParams: {
      //       start: startLocation.id,
      //       end: endLocation.id,
      //       terrain_difficulty: terrainDifficulty * 10
      //     }
      //   })
      // });
      // const data = await response.json();

      // Mock AI response - in a real app this would come from the AI service
      let mockResponse;
      if (userMessage.toLowerCase().includes('remove')) {
        mockResponse = {
          start: startLocation.id,
          end: endLocation.id,
          remove_array: ["Village A"], // Simplified for demo
          terrain_difficulty: terrainDifficulty * 10
        };
      } else if (userMessage.toLowerCase().includes('start')) {
        const newStart = LOCATIONS.find(loc => loc.id === 25); // Change to Town X
        mockResponse = {
          start: newStart.id,
          end: endLocation.id,
          remove_array: [],
          terrain_difficulty: terrainDifficulty * 10
        };
        setStartLocation(newStart);
      } else {
        mockResponse = {
          start: startLocation.id,
          end: endLocation.id,
          remove_array: [],
          terrain_difficulty: terrainDifficulty * 10
        };
      }

      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "I've updated the route based on your request.",
        sender: 'system'
      }]);

      return mockResponse;
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Sorry, there was an error processing your request. Please try again.",
        sender: 'system'
      }]);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user message submission
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message to chat
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user'
    };
    setMessages(prev => [...prev, newMessage]);

    if (!isInitialQuestionsComplete) return;

    try {
      // Call AI service to process the message
      const currentParams = {
        start: startLocation.id,
        end: endLocation.id,
        terrain_difficulty: terrainDifficulty * 10,
        remove_array: removeLocations
      };

      const aiResponse = await processNavigationCommand(message, currentParams, LOCATIONS);
      console.log(aiResponse);
      setTerrainDifficulty(aiResponse.terrain_difficulty / 10);
      setRemoveLocations((prev) => {
        return [...new Set([...prev, ...aiResponse.remove_array])];
      });

      // Add AI response to chat
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `I've processed your request and updated the route parameters.`,
        sender: 'system'
      }]);

      // Calculate new route with updated parameters
      await calculateRoute(aiResponse);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: error.message || "Sorry, I couldn't process that request.",
        sender: 'system'
      }]);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-white to-blue-100 ">
      {/* Chat Interface - Left Side */}
      <div className="w-1/3 flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className='p-2'>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h1 className="text-2xl font-bold tracking-tight">ADAPT | HackAiThon</h1>
            {/* <p className="text-blue-100 text-sm mt-1">AI-Powered Route Planning</p> */}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 ">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              text={message.text}
              sender={message.sender}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-blue-100 rounded-xl px-4 py-3 max-w-xs shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 bg-white">
          {!isInitialQuestionsComplete ? (
            <div className="space-y-6">
              <LocationSelector
                locations={LOCATIONS}
                selectedLocation={startLocation}
                onChange={setStartLocation}
                label="Start Location"
                className="ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <LocationSelector
                locations={LOCATIONS}
                selectedLocation={endLocation}
                onChange={setEndLocation}
                label="End Location"
                className="ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <SliderInput
                value={riskLevel}
                onChange={setRiskLevel}
                min={0}
                max={4}
                label="Allowed Risk Level"
                trackColor="bg-blue-200"
                thumbColor="bg-blue-600"
              />
              <SliderInput
                value={terrainDifficulty}
                onChange={setTerrainDifficulty}
                min={0}
                max={10}
                label="Terrain Difficulty"
                trackColor="bg-blue-200"
                thumbColor="bg-blue-600"
              />
            </div>
          ) : (
            <ChatInput
              onSend={handleSendMessage}
              disabled={isLoading}
              className="ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 rounded-xl"
            />
          )}
        </div>
      </div>

      {/* Route Viewer - Right Side */}
      <div className="w-1/3 flex flex-col shadow-inner">
        {/* Header */}
        {/* <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h1 className="text-2xl font-bold tracking-tight">Route Viewer</h1>
          <p className="text-blue-100 text-sm mt-1">Visualize your optimal path</p>
        </div> */}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 ">
          {routeData ? (
            <RouteViewer routeData={routeData} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-blue-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                {isInitialQuestionsComplete
                  ? "Calculating your optimal route..."
                  : "Complete the questions to generate your route"}
              </p>
              <p className="text-gray-400 mt-2">
                {isInitialQuestionsComplete
                  ? "Our AI is analyzing terrain, risk factors, and accessibility"
                  : "We'll personalize the route based on your preferences"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;