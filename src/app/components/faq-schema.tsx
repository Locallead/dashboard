"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BotIcon, Loader2Icon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { saveFaqSchema } from "../actions";

const faqSchema = z.object({
  "@context": z.literal("https://schema.org"),
  "@type": z.literal("FAQPage"),
  mainEntity: z.array(
    z.object({
      "@type": z.literal("Question"),
      name: z.string().min(1, "Question is required"),
      acceptedAnswer: z.object({
        "@type": z.literal("Answer"),
        text: z.string().min(1, "Answer is required"),
      }),
    })
  ),
});

type FaqSchemaType = z.infer<typeof faqSchema>;

interface Props {
  id: string;
  initialFaqs?: {
    id: string;
    question: string;
    answer: string;
    slug: string;
  }[];
  initialSchema?: string;
}

export default function FaqSchema({
  id,
  initialFaqs = [],
  initialSchema = "[]",
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [faqSchemaData, setFaqSchemaData] = useState<FaqSchemaType>({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [],
  });

  useEffect(() => {
    try {
      if (initialSchema && initialSchema !== "[]") {
        const parsedSchema = JSON.parse(initialSchema);
        const validatedSchema = faqSchema.parse(parsedSchema);
        setFaqSchemaData(validatedSchema);
      }
    } catch (error) {
      console.error("Error parsing initial schema:", error);
      // If the initial schema is invalid, we'll keep the default empty schema
    }
  }, [initialSchema]);

  const handleGenerateFaqs = async () => {
    setIsGenerating(true);
    try {
      const transformedFaqs: FaqSchemaType = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: initialFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };

      const parsed = faqSchema.parse(transformedFaqs);
      setFaqSchemaData(parsed);
      toast.success("FAQ Schema generated successfully");
    } catch (error) {
      console.error("Error generating FAQ schema:", error);
      toast.error("Failed to generate FAQ schema");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSchema = async () => {
    setIsSaving(true);
    try {
      const response = await saveFaqSchema({
        id,
        schema: JSON.stringify(faqSchemaData),
      });

      if (response.success) {
        toast.success("FAQ Schema saved successfully");
      } else {
        toast.error("Failed to save FAQ schema");
      }
    } catch (error) {
      console.error("Error saving FAQ schema:", error);
      toast.error("Failed to save FAQ schema");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-8">FAQ Schema</h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={isGenerating}
            onClick={handleGenerateFaqs}
          >
            {isGenerating ? (
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BotIcon className="w-4 h-4 mr-2" />
            )}
            Generate Schema
          </Button>
          <Button
            className="cursor-pointer"
            disabled={isSaving || faqSchemaData.mainEntity.length === 0}
            onClick={handleSaveSchema}
          >
            {isSaving ? (
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              "Save Schema"
            )}
          </Button>
        </div>
      </div>

      <Textarea
        className="font-mono"
        rows={10}
        value={JSON.stringify(faqSchemaData, null, 2)}
        onChange={(e) => {
          try {
            const newData = JSON.parse(e.target.value);
            const parsed = faqSchema.parse(newData);
            setFaqSchemaData(parsed);
          } catch (error) {
            console.error("Invalid FAQ schema:", error);
          }
        }}
      />
    </div>
  );
}
