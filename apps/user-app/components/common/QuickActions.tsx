import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Send, Plus } from "lucide-react";

interface QuickActionsProps {
  title?: string;
  onClickSend: () => void;
  onClickAdd: () => void;
}

export const QuickActions = ({ title, onClickSend, onClickAdd }: QuickActionsProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">{title || "Quick Actions"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button className="w-full h-auto py-4 " variant="default" onClick={onClickSend}>
            <Send className="mr-2 h-4 w-4" /> Send Money
          </Button>
          <Button className="w-full h-auto py-4" variant="outline" onClick={onClickAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Money
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
