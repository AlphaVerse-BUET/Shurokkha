"use client"

import { useState, useRef } from "react"
import { Upload, X, FileText, Image as ImageIcon, Video, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FileUploadWithPreviewProps {
  label: string
  description?: string
  accept?: string
  maxSize?: number // in MB
  required?: boolean
  onFileSelect: (file: File | null, preview: string | null) => void
  existingFile?: string | null
  error?: string
  aiVerifying?: boolean
  aiResult?: {
    verified: boolean
    confidence: number
    issues: string[]
  }
}

export default function FileUploadWithPreview({
  label,
  description,
  accept = "image/*",
  maxSize = 5,
  required = false,
  onFileSelect,
  existingFile = null,
  error,
  aiVerifying = false,
  aiResult,
}: FileUploadWithPreviewProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(existingFile)
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (selectedFile: File) => {
    setUploadError(null)

    // Validate file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setUploadError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Validate file type
    if (accept && !selectedFile.type.match(accept.replace("*", ".*"))) {
      setUploadError(`Invalid file type. Accepted: ${accept}`)
      return
    }

    setFile(selectedFile)

    // Create preview
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const previewUrl = reader.result as string
        setPreview(previewUrl)
        onFileSelect(selectedFile, previewUrl)
      }
      reader.readAsDataURL(selectedFile)
    } else if (selectedFile.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(selectedFile)
      setPreview(videoUrl)
      onFileSelect(selectedFile, videoUrl)
    } else {
      setPreview(null)
      onFileSelect(selectedFile, null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setFile(null)
    setPreview(null)
    setUploadError(null)
    onFileSelect(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = () => {
    if (!file) return <Upload className="w-8 h-8" />
    if (file.type.startsWith("image/")) return <ImageIcon className="w-8 h-8" />
    if (file.type.startsWith("video/")) return <Video className="w-8 h-8" />
    return <FileText className="w-8 h-8" />
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-primary bg-primary/10"
              : error || uploadError
                ? "border-red-500/50 bg-red-500/5"
                : "border-border hover:border-primary/50 hover:bg-accent/5"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
            data-testid={`file-upload-${label.toLowerCase().replace(/\s+/g, "-")}`}
          />
          <div className="flex flex-col items-center gap-2">
            {getFileIcon()}
            <p className="text-sm font-medium text-foreground">
              {dragActive ? "Drop file here" : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-muted-foreground">
              {accept} • Max {maxSize}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border-2 border-border rounded-lg p-4 relative">
          {/* AI Verification Status */}
          {aiVerifying && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className="bg-blue-500 gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                AI Verifying...
              </Badge>
            </div>
          )}

          {aiResult && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className={aiResult.verified ? "bg-green-600" : "bg-red-600"}>
                {aiResult.verified ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified {aiResult.confidence}%
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Failed
                  </>
                )}
              </Badge>
            </div>
          )}

          {/* Preview */}
          {file?.type.startsWith("image/") && preview && (
            <div className="relative w-full h-48 mb-3">
              <Image src={preview} alt="Preview" fill className="object-contain rounded" />
            </div>
          )}

          {file?.type.startsWith("video/") && preview && (
            <video src={preview} controls className="w-full h-48 mb-3 rounded" />
          )}

          {/* File Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0">{getFileIcon()}</div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {file?.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Unknown size"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove} className="flex-shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* AI Verification Results */}
          {aiResult && !aiResult.verified && aiResult.issues.length > 0 && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs font-semibold text-red-700 mb-1">Verification Issues:</p>
              <ul className="text-xs text-red-600 space-y-1">
                {aiResult.issues.map((issue, idx) => (
                  <li key={idx}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error || uploadError}
        </p>
      )}
    </div>
  )
}
