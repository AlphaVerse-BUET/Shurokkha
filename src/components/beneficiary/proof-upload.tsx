"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Upload,
  X,
  FileImage,
  FileVideo,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProofFile {
  id: string
  file: File
  preview: string
  type: "image" | "video"
  uploadProgress: number
  aiVerification?: {
    status: "verifying" | "verified" | "flagged" | "rejected"
    confidence: number
    issues: string[]
  }
}

interface ProofUploadProps {
  title?: string
  description?: string
  maxFiles?: number
  acceptedTypes?: string[]
  onFilesChange?: (files: ProofFile[]) => void
  existingProofs?: string[]
}

export function ProofUpload({
  title = "Upload Crisis Proof Documents",
  description = "Upload photos or videos proving your crisis situation. AI will verify authenticity.",
  maxFiles = 5,
  acceptedTypes = ["image/*", "video/*"],
  onFilesChange,
  existingProofs = [],
}: ProofUploadProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState<ProofFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: ProofFile[] = []
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]

      // Validate file type
      const isImage = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")

      if (!isImage && !isVideo) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a valid image or video file.`,
          variant: "destructive",
        })
        continue
      }

      // Validate file size (max 10MB for images, 50MB for videos)
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds ${isVideo ? "50MB" : "10MB"} limit.`,
          variant: "destructive",
        })
        continue
      }

      // Check max files limit
      if (files.length + newFiles.length >= maxFiles) {
        toast({
          title: "Maximum Files Reached",
          description: `You can only upload up to ${maxFiles} files.`,
          variant: "destructive",
        })
        break
      }

      // Create preview URL
      const preview = URL.createObjectURL(file)

      const proofFile: ProofFile = {
        id: `${Date.now()}-${i}`,
        file,
        preview,
        type: isImage ? "image" : "video",
        uploadProgress: 0,
      }

      newFiles.push(proofFile)

      // Simulate upload and AI verification
      simulateUpload(proofFile)
    }

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const simulateUpload = async (proofFile: ProofFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setFiles((prev) =>
        prev.map((f) => (f.id === proofFile.id ? { ...f, uploadProgress: progress } : f))
      )
    }

    // Simulate AI verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const confidence = 75 + Math.random() * 20 // 75-95%
    const hasIssues = Math.random() > 0.8

    const aiVerification = {
      status: hasIssues ? ("flagged" as const) : confidence > 85 ? ("verified" as const) : ("flagged" as const),
      confidence: Math.round(confidence),
      issues: hasIssues
        ? ["Low image quality detected", "Metadata missing"]
        : confidence < 85
          ? ["Manual review recommended"]
          : [],
    }

    setFiles((prev) =>
      prev.map((f) => (f.id === proofFile.id ? { ...f, aiVerification } : f))
    )

    if (aiVerification.status === "verified") {
      toast({
        title: "Verification Complete",
        description: `${proofFile.file.name} verified successfully (${aiVerification.confidence}% confidence)`,
      })
    } else {
      toast({
        title: "Verification Flagged",
        description: `${proofFile.file.name} requires manual review`,
        variant: "destructive",
      })
    }
  }

  const removeFile = (id: string) => {
    const file = files.find((f) => f.id === id)
    if (file) {
      URL.revokeObjectURL(file.preview)
    }
    const updatedFiles = files.filter((f) => f.id !== id)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const getVerificationBadge = (aiVerification?: ProofFile["aiVerification"]) => {
    if (!aiVerification) return null

    const badges = {
      verifying: { icon: Loader2, label: "Verifying...", className: "bg-blue-500 animate-pulse" },
      verified: { icon: CheckCircle, label: "AI Verified", className: "bg-green-500" },
      flagged: { icon: AlertCircle, label: "Flagged", className: "bg-yellow-500" },
      rejected: { icon: X, label: "Rejected", className: "bg-red-500" },
    }

    const badge = badges[aiVerification.status]
    const Icon = badge.icon

    return (
      <Badge className={`${badge.className} text-white gap-1`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
            ${files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary"}
          `}
        >
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(",")}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="proof-upload"
            disabled={files.length >= maxFiles}
          />
          <label
            htmlFor="proof-upload"
            className={files.length >= maxFiles ? "cursor-not-allowed" : "cursor-pointer"}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragging ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Accepts images (max 10MB) and videos (max 50MB) • {files.length}/{maxFiles} files
            </p>
          </label>
        </div>

        {/* Existing Proofs */}
        {existingProofs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Previously Uploaded ({existingProofs.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {existingProofs.map((proof, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border">
                  <img src={proof} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                  <Badge className="absolute top-1 right-1 bg-green-500 text-white text-xs">
                    Verified
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">New Uploads ({files.length})</h4>
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start gap-3">
                  {/* Preview */}
                  <div className="relative w-16 h-16 rounded overflow-hidden shrink-0 bg-muted">
                    {file.type === "image" ? (
                      <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={file.preview} className="w-full h-full object-cover" />
                    )}
                    {file.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <FileVideo className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {getVerificationBadge(file.aiVerification)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {file.uploadProgress < 100 && (
                      <div className="mt-2">
                        <Progress value={file.uploadProgress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploading... {file.uploadProgress}%
                        </p>
                      </div>
                    )}

                    {/* AI Verification */}
                    {file.aiVerification && (
                      <div className="mt-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">AI Confidence:</span>
                          <span className="font-medium">{file.aiVerification.confidence}%</span>
                        </div>
                        {file.aiVerification.issues.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {file.aiVerification.issues.map((issue, idx) => (
                              <p key={idx} className="text-yellow-600 dark:text-yellow-400">
                                • {issue}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Text */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-900 dark:text-blue-100">Proof Guidelines</p>
              <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-xs">
                <li>• Photos should clearly show the crisis situation (damage, medical condition, etc.)</li>
                <li>• Include official documents if available (medical reports, damage certificates)</li>
                <li>• Videos should be under 50MB and show clear evidence</li>
                <li>• AI will verify authenticity using metadata and image analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
