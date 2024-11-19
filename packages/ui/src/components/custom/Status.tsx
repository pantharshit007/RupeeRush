import { Badge } from "@repo/ui/components/ui/badge";
import { cn } from "@repo/ui/lib/utils";

interface StatusProps {
  status: "SUCCESS" | "FAILURE" | "PROCESSING";
  className?: string;
}

function Status({ status, className }: StatusProps) {
  let variants: "successOutline" | "processingOutline" | "errorOutline" | "default";

  switch (status) {
    case "SUCCESS":
      variants = "successOutline";
      break;

    case "FAILURE":
      variants = "errorOutline";
      break;

    case "PROCESSING":
      variants = "processingOutline";
      break;

    default:
      variants = "default";
  }

  return (
    <Badge variant={variants} className={cn("px-2 py-[4px] rounded-md ", className)}>
      {status}
    </Badge>
  );
}

export default Status;
