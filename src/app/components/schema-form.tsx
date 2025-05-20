"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateBusinessSchema, getBusiness } from "@/app/actions";
import { Loader2 } from "lucide-react";

const schemaFormSchema = z.object({
  schema: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, "Please enter valid JSON"),
});

type SchemaFormValues = z.infer<typeof schemaFormSchema>;

export default function SchemaForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SchemaFormValues>({
    resolver: zodResolver(schemaFormSchema),
    defaultValues: {
      schema: "",
    },
  });

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const business = await getBusiness(id);
        if (business?.themeScript) {
          form.reset({
            schema: business.themeScript,
          });
        }
      } catch (error) {
        console.error("Error fetching schema:", error);
        toast.error("Error", {
          description: "Failed to load existing schema",
        });
      }
    };

    fetchSchema();
  }, [id, form]);

  const onSubmit = async (data: SchemaFormValues) => {
    setIsLoading(true);
    try {
      const result = await updateBusinessSchema(id, data.schema);

      if (result.success) {
        toast.success("Schema Updated", {
          description: "The JSON-LD schema has been successfully updated.",
        });
        router.refresh();
      } else {
        toast.error("Error", {
          description:
            result.error || "Failed to update schema. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating schema:", error);
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="schema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JSON-LD Schema</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your JSON-LD schema here..."
                        className="min-h-[200px] font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Schema"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
