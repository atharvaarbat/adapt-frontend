export async function processNavigationCommand(userMessage, currentParams) {
    // System prompt that guides the AI
    const systemPrompt = `You are a navigation assistant that converts natural language requests into route parameters.
    
    Current route parameters:
    - Start location ID: ${currentParams.start}
    - End location ID: ${currentParams.end}
    - Terrain difficulty: ${currentParams.terrain_difficulty}
    - Locations to remove: ${currentParams.remove_array.join(', ') || 'none'}
  
    Convert the user's request into the exact JSON format specified. Only include fields that should change.`;
  
    try {
      const response = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "local-model", // Use your loaded model name
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "route_parameters",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  start: {
                    type: "number",
                    description: "Start location ID (only if changed)"
                  },
                  end: {
                    type: "number",
                    description: "End location ID (only if changed)"
                  },
                  remove_array: {
                    type: "array",
                    items: {
                      type: "string"
                    },
                    description: "Locations to avoid (empty if none)"
                  },
                  terrain_difficulty: {
                    type: "number",
                    minimum: 0,
                    maximum: 100,
                    description: "Terrain difficulty (0-100)"
                  }
                }
              }
            }
          },
          temperature: 0.3, // Lower for more deterministic outputs
          max_tokens: 200,
          stream: false
        })
      });
  
      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }
  
      const data = await response.json();
      const aiContent = data.choices[0]?.message?.content;
      
      // Parse and merge with current parameters
      const aiUpdate = JSON.parse(aiContent);
      const mergedParams = {
        start: aiUpdate.start ?? currentParams.start,
        end: aiUpdate.end ?? currentParams.end,
        remove_array: aiUpdate.remove_array ?? currentParams.remove_array,
        terrain_difficulty: aiUpdate.terrain_difficulty ?? currentParams.terrain_difficulty
      };
  
      return validateAIResponse(mergedParams);
      
    } catch (error) {
      console.error("Local AI processing error:", error);
      throw new Error("Failed to process your navigation request");
    }
  }
  
  function validateAIResponse(response) {
    // Validation remains the same as previous implementation
    if (!response) throw new Error("No response from AI");
    if (typeof response.start !== 'number') throw new Error("Invalid start location");
    if (typeof response.end !== 'number') throw new Error("Invalid end location");
    if (!Array.isArray(response.remove_array)) throw new Error("Invalid remove array");
    if (typeof response.terrain_difficulty !== 'number' || 
        response.terrain_difficulty < 0 || 
        response.terrain_difficulty > 100) {
      throw new Error("Terrain difficulty must be between 0 and 100");
    }
    return response;
  }