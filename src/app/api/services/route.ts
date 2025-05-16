import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { prompt, businessName, cityName } = await req.json();
    const serviceSchema = z.object({
      services: z
        .array(
          z.object({
            id: z.string().describe("The id of the service"),
            name: z.string().describe("The name of the service"),
            description: z.string().describe("The description of the service"),
          })
        )
        .describe("A list of services with name and description"),
    });

    let enhancedPrompt = prompt;

    enhancedPrompt = `${prompt}.
    The city name is ${cityName} and the business name is ${businessName}.
    You are an seo expert and you create local seo pages for garage door repair providers businesses and you will generate a service name and description the title will be only the title but the description will be the description of the service and seo optimized include business name and city name.
    Each service should include a name and description and id. Minimum 6 Services`;

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: serviceSchema,
      prompt: enhancedPrompt,
      temperature: 0.7,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Error generating services:", error);
    return Response.json(
      { error: "Failed to generate services" },
      { status: 500 }
    );
  }
}
