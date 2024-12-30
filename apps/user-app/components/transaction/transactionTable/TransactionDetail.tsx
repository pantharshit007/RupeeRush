import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/ui/dialog";
import { Transaction, TransactionType, TransactionStatus } from "@repo/schema/types";
import { format } from "date-fns";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  if (!transaction) return null;

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return "text-green-600";
      case TransactionStatus.FAILURE:
        return "text-red-600";
      case TransactionStatus.PROCESSING:
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const formatAmount = (amount: number) => {
    const isReceive = transaction.type === TransactionType.RECEIVE;
    return `${isReceive ? "+" : "-"}₹${(amount / 100).toLocaleString()}`;
  };

  const renderTransactionSpecificDetails = () => {
    const details = transaction.details;

    switch (transaction.type) {
      case TransactionType.DEPOSIT:
      case TransactionType.WITHDRAW:
        return (
          <>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="font-semibold">Provider:</span>
              <span>{details?.provider || "N/A"}</span>
            </div>
          </>
        );

      case TransactionType.TRANSFER:
        return (
          <>
            {/* P2P txn details */}
            {transaction.transferMethod && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">Transfer Method:</span>
                <span>{transaction.transferMethod}</span>
              </div>
            )}
            {details?.receiverIdentifier && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">Receiver Identifier:</span>
                <span>{details.receiverIdentifier}</span>
              </div>
            )}

            {/* B2B txn details */}
            {details.senderBank && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">From Bank:</span>
                <span>{details?.senderBank || "N/A"}</span>
              </div>
            )}
            {details.receiverBank && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">To Bank:</span>
                <span>{details?.receiverBank || "N/A"}</span>
              </div>
            )}

            {details?.senderAccount && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">From Account:</span>
                <span className="font-mono">XXXX{details.senderAccount.slice(-4)}</span>
              </div>
            )}
            {details?.receiverAccount && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">To Account:</span>
                <span className="font-mono">XXXX{details.receiverAccount.slice(-4)}</span>
              </div>
            )}
          </>
        );

      case TransactionType.RECEIVE:
        return (
          <>
            {/* P2P txn details */}
            {transaction.transferMethod && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">Transfer Method:</span>
                <span>{transaction.transferMethod}</span>
              </div>
            )}
            {details?.senderIdentifier && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">Sender Identifier:</span>
                <span className="font-mono">{details.senderIdentifier}</span>
              </div>
            )}

            {/* B2B txn details */}
            {details.senderBank && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">From Bank:</span>
                <span className="font-mono">{details?.senderBank || "N/A"}</span>
              </div>
            )}
            {details.receiverBank && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">To Bank:</span>
                <span className="font-mono">{details?.receiverBank || "N/A"}</span>
              </div>
            )}

            {details?.senderAccount && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">From Account:</span>
                <span className="font-mono">XXXX{details.senderAccount.slice(-4)}</span>
              </div>
            )}
            {details?.receiverAccount && (
              <div className="grid grid-cols-2 items-center gap-4">
                <span className="font-semibold">To Account:</span>
                <span className="font-mono">XXXX{details.receiverAccount.slice(-4)}</span>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Transaction ID:</span>
            <span className="font-mono text-sm">{transaction.id}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Date:</span>
            <span className="font-mono text-sm">
              {format(new Date(transaction.date), "dd/MM/yyyy hh:mm a")}
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Amount:</span>
            <span className={transaction.type === TransactionType.RECEIVE ? "text-green-600" : ""}>
              {formatAmount(transaction.amount)}
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Type:</span>
            <span>{transaction.type}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Status:</span>
            <span className={getStatusColor(transaction.status)}>{transaction.status}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="font-semibold">Recipient / Sender:</span>
            <span>{transaction.recipientOrSender || "N/A"}</span>
          </div>
          {renderTransactionSpecificDetails()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
