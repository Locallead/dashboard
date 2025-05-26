"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Edit, Loader2Icon, BotIcon } from "lucide-react";
import { toast } from "sonner";
import { createFaqs } from "../actions";

const generateSlug = (question: string): string => {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

interface FAQ {
  id: string;
  question: string;
  answer: string;
  slug: string;
}

export function FaqGenerator({
  id,
  initFaqs,
  businessName,
  cityName,
}: {
  id: string;
  initFaqs?: FAQ[];
  businessName: string;
  cityName: string;
}) {
  const [faqs, setFaqs] = useState<FAQ[]>(initFaqs || []);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFaq = () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Please fill in both question and answer fields");
      return;
    }

    const newFaq: FAQ = {
      id: editingId || Date.now().toString(),
      question: question.trim(),
      answer: answer.trim(),
      slug: generateSlug(question),
    };

    if (editingId) {
      setFaqs(faqs.map((faq) => (faq.id === editingId ? newFaq : faq)));
      setEditingId(null);
    } else {
      setFaqs([...faqs, newFaq]);
    }

    setQuestion("");
    setAnswer("");
    setShowForm(false);
  };

  const handleEditFaq = (faq: FAQ) => {
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const response = await createFaqs({ id, data: faqs });
    if (response.success) {
      setIsLoading(false);
      toast.success("FAQs saved successfully");
    } else {
      setIsLoading(false);
      toast.error("Failed to save FAQs");
    }
  };

  const generateFaqsWithAI = async () => {
    setIsLoading(true);
    const response = await fetch("/api/faqs", {
      method: "POST",
      body: JSON.stringify({
        prompt: "Generate FAQs for a business",
        businessName,
        cityName,
      }),
    });

    if (!response.ok) {
      setIsLoading(false);
      toast.error("Failed to generate FAQs");
      return;
    }

    const data = await response.json();

    // Ensure all FAQs have proper slugs
    const faqsWithSlugs = data.faqs.map((faq: FAQ) => ({
      ...faq,
      slug: generateSlug(faq.question),
    }));

    setFaqs(faqsWithSlugs);
    toast.success("FAQs generated successfully");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 mt-4">
      <h2 className="text-2xl font-bold">FAQs</h2>
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setQuestion("");
              setAnswer("");
              setEditingId(null);
            }
          }}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          {showForm ? "Cancel" : "Add FAQ"}
        </Button>
        <Button variant="outline" size="sm" onClick={generateFaqsWithAI}>
          {isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>
              <BotIcon className="h-4 w-4 mr-2" />
              Generate FAQs
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter FAQ question"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter FAQ answer"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddFaq}>
              {editingId ? "Update FAQ" : "Add FAQ"}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardHeader>
              <CardTitle className="text-lg">{faq.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{faq.answer}</p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditFaq(faq)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteFaq(faq.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {faqs.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2Icon className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
