"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBusinessLogo } from "../actions";
import { ImageIcon } from "lucide-react";

interface UploadLogoProps {
  businessId: string;
  currentLogo?: string;
}

export function UploadLogo({
  businessId,
  currentLogo = "/logo.svg",
}: UploadLogoProps) {
  const [logoUrl, setLogoUrl] = useState(currentLogo);
  const [previewUrl, setPreviewUrl] = useState(currentLogo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewUrl(e.target.value);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await updateBusinessLogo(businessId, previewUrl);

      if (result.success) {
        setLogoUrl(previewUrl);
      } else {
        setError(result.error || "Failed to update logo");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isDefaultLogo = previewUrl === "/logo.svg";

  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-2xl font-bold">Upload Logo</h2>
      <div className="flex flex-1 gap-4">
        <Input
          type="url"
          placeholder="Enter logo URL"
          value={previewUrl}
          onChange={handleUrlChange}
          className="flex-1 w-fit"
        />
        <Button
          onClick={handleSave}
          disabled={isLoading || previewUrl === logoUrl}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="relative flex-1 w-48 h-48 mx-auto border rounded-lg overflow-hidden bg-muted/20">
        {isDefaultLogo ? (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="w-16 h-16 text-muted-foreground" />
          </div>
        ) : (
          <img
            src={previewUrl || undefined}
            alt="Logo preview"
            className="w-full h-full object-contain"
            onError={() => setError("Invalid image URL")}
          />
        )}
      </div>
    </div>
  );
}
