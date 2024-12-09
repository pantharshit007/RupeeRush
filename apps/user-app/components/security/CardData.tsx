import { useState } from "react";
import { toast } from "sonner";
import { Copy, Eye, EyeOff } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export const CardDataItem = ({
  label,
  value,
  isSecret = false,
}: {
  label: string;
  value: string;
  isSecret?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(!isSecret);

  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium font-mono">
          {isVisible ? value : isSecret ? "•".repeat(value.length) : value}
        </span>
        {isSecret && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.info("Copied to clipboard");
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
