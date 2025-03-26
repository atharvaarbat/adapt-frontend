import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY, // Store in your .env file
  dangerouslyAllowBrowser: true // Only for frontend implementation
});

export async function processNavigationCommand(userMessage, currentParams, LOCATIONS) {
  // System prompt that guides the AI
  console.log(currentParams);
  const systemPrompt = `You are a navigation assistant that helps modify route parameters based on user requests. 
  Your task is to interpret natural language requests and output JSON that can be used to calculate new routes.
  
  For your reference here is the list of locations: ${JSON.stringify(LOCATIONS)}

  Current parameters:
  - Start location ID: ${currentParams.start}
  - End location ID: ${currentParams.end}
  - Terrain difficulty: ${currentParams.terrain_difficulty}
  - Locations to remove: ${currentParams.remove_array.join(', ') || 'none'}
  
  Respond ONLY with valid JSON in this exact format:
  {
    "start": number, // start location ID (change only if requested)
    "end": number,   // end location ID (change only if requested)
    "remove_array": string[], // locations to avoid
    "terrain_difficulty": number // 0-100 scale
  }`;

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      response_format: {
        "type": "json_schema",
        "json_schema": {
          "name": "routing",
          "strict": true,
          "schema": {
            "type": "object",
            "properties": {
              "start": {
                "type": "number",
                "description": "Location ID from the given set of locations"
              },
              "end": {
                "type": "number",
                "description": "Location ID from the given set of locations"
              },
              "remove_array": {
                "type": "array",
                "description": "Create an array of locations that the user mentioned to remove. Keep the existing removed locations."
              }
            },
            "required": ["start", "end", "remove_array"],
            "additionalProperties": false
          }
        }
      },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.2 // Lower temperature for more predictable outputs
    });
    
    const response = completion.choices[0]?.message?.content;
    const parsed = JSON.parse(response.replace("```json", '').replace("```", ''));
    console.log(parsed);
    return parsed;
  } catch (error) {
    console.error("AI processing error:", error);
    throw new Error("Failed to process your request with AI");
  }
}