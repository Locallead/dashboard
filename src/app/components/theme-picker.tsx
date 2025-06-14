"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { updateBusinessTheme } from "@/app/actions";
import { Loader2 } from "lucide-react";

export default function ThemePicker({
  id,
  initTheme,
}: {
  id: string;
  initTheme?: string;
}) {
  const [theme, setTheme] = useState(initTheme?.toString() || "1");
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const { success } = await updateBusinessTheme(id, theme);
    if (success) {
      toast.success("Theme saved");
    } else {
      toast.error("Failed to save theme");
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col gap-4 flex-1">
      <h2 className="text-2xl font-bold">Choose a theme</h2>
      <div className="flex gap-4">
        <Image
          className={`${
            theme === "1"
              ? "border-4 border-blue-500"
              : "border-4 border-gray-300"
          }`}
          alt="Doormatic"
          src="/doormatic.png"
          width={180}
          height={100}
          onClick={() => handleThemeChange("1")}
        />
        <Image
          className={`${
            theme === "2"
              ? "border-4 border-blue-500"
              : "border-4 border-gray-300"
          }`}
          alt="Theme 2"
          src="/theme-2.png"
          width={180}
          height={100}
          onClick={() => handleThemeChange("2")}
        />
      </div>
      <Button
        onClick={handleSave}
        className="w-fit cursor-pointer"
        disabled={isSaving}
      >
        {isSaving ? <Loader2 className="animate-spin" /> : "Save"}
      </Button>
    </div>
  );
}
