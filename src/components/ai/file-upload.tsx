"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, X, FileText, ImageIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  status: "uploading" | "processing" | "success" | "error"
  aiValidation?: {
    status: "pending" | "valid" | "invalid"
    confidence: number
    issues?: string[]
  }
}

interface FileUploadProps {
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  onFilesChange?: (files: UploadedFile[]) => void
  aiValidation?: boolean
  validationType?: "document" | "image" | "nid" | "receipt"
  className?: string
}

export function FileUpload({
  accept = "image/*,.pdf",
  maxSize = 5,
  maxFiles = 10,
  onFilesChange,
  aiValidation = false,
  validationType = "document",
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const simulateAIValidation = async (file: UploadedFile): Promise<UploadedFile> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 2000))

    const confidence = 75 + Math.random() * 25
    const isValid = confidence > 80

    return {
      ...file,
      status: "success",
      aiValidation: {
        status: isValid ? "valid" : "invalid",
        confidence: Math.round(confidence),
        issues: isValid
          ? undefined
          : ["Document quality low", "Text partially obscured", "Possible tampering detected"].slice(
              0,
              Math.floor(Math.random() * 3) + 1,
            ),
      },
    }
  }

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles: UploadedFile[] = Array.from(fileList).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        status: "uploading" as const,
      }))

      if (files.length + newFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`)
        return
      }

      setFiles((prev) => [...prev, ...newFiles])

      // Simulate upload and AI validation
      for (const file of newFiles) {
        // Simulate upload
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setFiles((prev) =>
          prev.map((f) => (f.id === file.id ? { ...f, status: aiValidation ? "processing" : "success" } : f)),
        )

        // AI validation if enabled
        if (aiValidation) {
          const validatedFile = await simulateAIValidation(file)
          setFiles((prev) => prev.map((f) => (f.id === file.id ? validatedFile : f)))
        }
      }

      // Notify parent
      if (onFilesChange) {
        onFilesChange([...files, ...newFiles])
      }
    },
    [files, maxFiles, aiValidation, onFilesChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
    if (onFilesChange) {
      onFilesChange(files.filter((f) => f.id !== id))
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        )}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm font-medium mb-2">Drag and drop files here, or click to browse</p>
        <p className="text-xs text-muted-foreground mb-4">
          Maximum {maxSize}MB per file. Up to {maxFiles} files.
        </p>
        <input
          type="file"
          accept={accept}
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button asChild variant="outline" size="sm">
          <label htmlFor="file-upload" className="cursor-pointer">
            Browse Files
          </label>
        </Button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <Card key={file.id} className="p-4">
              <div className="flex items-start gap-3">
                {/* File Icon */}
                <div className="shrink-0">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="h-8 w-8 text-blue-500" />
                  ) : (
                    <FileText className="h-8 w-8 text-gray-500" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)} className="h-6 w-6 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                  {/* Status */}
                  {file.status === "uploading" && (
                    <div className="space-y-1">
                      <Progress value={60} className="h-1" />
                      <p className="text-xs text-muted-foreground">Uploading...</p>
                    </div>
                  )}

                  {file.status === "processing" && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-xs font-medium">AI Validation in progress...</p>
                    </div>
                  )}

                  {file.status === "success" && file.aiValidation && (
                    <div
                      className={cn(
                        "flex items-start gap-2 p-2 rounded-md",
                        file.aiValidation.status === "valid" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700",
                      )}
                    >
                      {file.aiValidation.status === "valid" ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">
                          {file.aiValidation.status === "valid" ? "Verified" : "Validation Failed"} (
                          {file.aiValidation.confidence}% confidence)
                        </p>
                        {file.aiValidation.issues && (
                          <ul className="text-xs mt-1 space-y-0.5">
                            {file.aiValidation.issues.map((issue, i) => (
                              <li key={i}>• {issue}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  {file.status === "success" && !file.aiValidation && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <p className="text-xs font-medium">Uploaded successfully</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
