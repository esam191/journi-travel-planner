"use client";

import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ConfirmDeleteDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
  trigger?: ReactNode;
};

export default function ConfirmDeleteDialog({
  title,
  description,
  confirmLabel,
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  trigger,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              void onConfirm();
            }}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
