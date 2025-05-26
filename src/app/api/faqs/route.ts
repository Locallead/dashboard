import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { prompt, businessName, cityName } = await req.json();
    const faqSchema = z.object({
      faqs: z
        .array(
          z.object({
            id: z.string().describe("The id of the FAQ"),
            question: z.string().describe("The question for the FAQ"),
            answer: z.string().describe("The answer to the FAQ question"),
          })
        )
        .describe("A list of FAQs with questions and answers"),
    });

    let enhancedPrompt = prompt;

    enhancedPrompt = `${prompt}.
    The city name is ${cityName} and the business name is ${businessName}.
    You are an SEO expert and you create local SEO pages for garage door repair providers businesses.
    Generate a list of frequently asked questions and answers that are:
    1. Relevant to garage door repair services
    2. Localized to mention the business name and city when appropriate
    3. SEO optimized with strategic keywords
    4. Written in a clear, professional tone
    5. Addressing common customer concerns and questions
    6. Including technical and maintenance questions
    7. Covering pricing, service areas, and availability
    Each FAQ should include a question and detailed answer. Minimum 8 FAQs.`;

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: faqSchema,
      prompt: enhancedPrompt,
      temperature: 0.7,
    });

    return Response.json(object);
  } catch (error) {
    console.error("Error generating FAQs:", error);
    return Response.json({ error: "Failed to generate FAQs" }, { status: 500 });
  }
}
