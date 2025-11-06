"use client"

import { Button } from "./button"
import { Card } from "./card"
import { AlertTriangle } from "lucide-react"

interface ConfirmationDialogProps {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: "danger" | "warning" | "info"
}

export function ConfirmationDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "warning",
}: ConfirmationDialogProps) {
  const variantColors = {
    danger: "text-red-600",
    warning: "text-orange-600",
    info: "text-blue-600",
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 animate-in zoom-in-95">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`p-2 rounded-full bg-${variant === "danger" ? "red" : variant === "warning" ? "orange" : "blue"}-100`}
          >
            <AlertTriangle className={`w-6 h-6 ${variantColors[variant]}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            className={
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700"
                : variant === "warning"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : ""
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </Card>
    </div>
  )
}
