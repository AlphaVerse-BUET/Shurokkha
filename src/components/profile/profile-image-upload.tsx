"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ProfileImageUploadProps {
  currentImage?: string
  userName: string
  onImageChange?: (imageUrl: string) => void
  className?: string
}

export function ProfileImageUpload({ currentImage, userName, onImageChange, className }: ProfileImageUploadProps) {
  const [image, setImage] = useState(currentImage)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const imageUrl = URL.createObjectURL(file)
    setImage(imageUrl)
    setIsUploading(false)

    if (onImageChange) {
      onImageChange(imageUrl)
    }
  }

  const removeImage = () => {
    setImage(undefined)
    if (onImageChange) {
      onImageChange("")
    }
  }

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={image || "/placeholder.svg"} alt={userName} />
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        {image && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="absolute -bottom-2 -right-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="profile-image-upload"
            disabled={isUploading}
          />
          <Button asChild size="icon" className="h-10 w-10 rounded-full shadow-lg" disabled={isUploading}>
            <label htmlFor="profile-image-upload" className="cursor-pointer">
              {isUploading ? <Upload className="h-4 w-4 animate-pulse" /> : <Camera className="h-4 w-4" />}
            </label>
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-medium">{userName}</p>
        <p className="text-xs text-muted-foreground">Click camera icon to upload photo</p>
      </div>
    </div>
  )
}
