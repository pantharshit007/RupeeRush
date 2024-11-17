import { Badge } from "@repo/ui/components/ui/badge";

function Status({ status }: { status: "SUCCESS" | "FAILURE" | "PROCESSING" }) {
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
    <Badge variant={variants} className="px-2 py-[4px] rounded-md ">
      {status}
    </Badge>
  );
}

export default Status;
