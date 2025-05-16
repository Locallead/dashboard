import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

interface ReferenceLocation {
  city: string;
  state: string;
}

export async function POST(req: Request) {
  try {
    const { prompt, referenceLocation } = await req.json();

    const locationSchema = z.object({
      locations: z
        .array(
          z.object({
            city: z.string().describe("The name of the city"),
            state: z
              .string()
              .describe("The state or province where the city is located"),
          })
        )
        .describe("A list of locations with city and state information"),
    });

    let enhancedPrompt = prompt;

    if (referenceLocation) {
      enhancedPrompt = `${prompt}. 
      Focus on generating cities that are geographically near ${referenceLocation.city}, ${referenceLocation.state}.
      These should be real cities within the same region or neighboring areas.
      Ensure the state is provided as the standard two-letter code when applicable (e.g., CA for California).`;
    } else {
      enhancedPrompt = `${prompt}.
      Each location should include a city name and its corresponding state or province.
      Ensure the state is provided as the standard two-letter code when applicable (e.g., CA for California).`;
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: locationSchema,
      prompt: enhancedPrompt,
      temperature: 0.7,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Error generating locations:", error);
    return Response.json(
      { error: "Failed to generate locations" },
      { status: 500 }
    );
  }
}
