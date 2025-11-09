"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CrisisType } from "@/types"
import { useAppStore } from "@/store/app-store"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MapPin, Users, DollarSign, X, Upload, Image as ImageIcon } from "lucide-react"

const CRISIS_TYPES: CrisisType[] = ["flood", "fire", "medical", "poverty", "education", "livelihood"]
const DIVISIONS = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Barisal", "Rangpur", "Mymensingh"]

interface CreateCrisisModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateCrisisModal({ open, onClose }: CreateCrisisModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { currentRole, currentUser } = useAppStore()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "flood" as CrisisType,
    division: "Dhaka",
    district: "Dhaka",
    severity: 50,
    affectedPopulation: 0,
    fundingNeeded: 0,
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + selectedImages.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 5 images",
        variant: "destructive",
      })
      return
    }

    setSelectedImages((prev) => [...prev, ...files])
    
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[CreateCrisisModal] Creating crisis:", formData, "Images:", selectedImages)
    toast({
      title: "Crisis Created",
      description: "Crisis has been successfully added to the platform",
    })
    onClose()
    // Reset form
    setFormData({
      title: "",
      description: "",
      type: "flood" as CrisisType,
      division: "Dhaka",
      district: "Dhaka",
      severity: 50,
      affectedPopulation: 0,
      fundingNeeded: 0,
    })
    setSelectedImages([])
    setImagePreviews([])
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 75) return "text-red-600"
    if (severity >= 50) return "text-orange-600"
    if (severity >= 25) return "text-yellow-600"
    return "text-blue-600"
  }

  // Facebook-style image collage layout
  const getImageCollageLayout = () => {
    const count = imagePreviews.length
    if (count === 0) return null

    if (count === 1) {
      return (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
          <img 
            src={imagePreviews[0]} 
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => removeImage(0)}
            className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative aspect-square bg-muted group">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          <div className="relative aspect-square bg-muted group">
            <img 
              src={imagePreviews[0]} 
              alt="Preview 1"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(0)}
              className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-rows-2 gap-1">
            {imagePreviews.slice(1, 3).map((preview, index) => (
              <div key={index + 1} className="relative aspect-square bg-muted group">
                <img 
                  src={preview} 
                  alt={`Preview ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index + 1)}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (count === 4) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative aspect-square bg-muted group">
              <img 
                src={preview} 
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )
    }

    if (count >= 5) {
      return (
        <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
          <div className="relative aspect-square bg-muted group">
            <img 
              src={imagePreviews[0]} 
              alt="Preview 1"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(0)}
              className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-rows-2 gap-1">
            <div className="relative aspect-square bg-muted group">
              <img 
                src={imagePreviews[1]} 
                alt="Preview 2"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(1)}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {imagePreviews.slice(2, 5).map((preview, index) => (
                <div key={index + 2} className="relative aspect-square bg-muted group">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 3}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index + 2)}
                    className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Decorative header background */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-br from-primary/20 via-accent/10 to-background -z-10" />
          
          <div className="p-6">
            <DialogHeader className="mb-6 relative">
              <DialogTitle className="text-3xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                Create Crisis Report
              </DialogTitle>
              <p className="text-sm text-foreground/60 mt-2">
                Share critical information to mobilize aid and support
              </p>
            </DialogHeader>

            {/* User Info Header - Facebook style */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/40 bg-card/50 -mx-6 px-6 py-4 rounded-t-lg">
              <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                <AvatarImage src={currentUser?.profileImage} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {currentUser?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{currentUser?.name || "User"}</h3>
                <Badge variant="secondary" className="text-xs mt-1">
                  {currentRole === "admin" ? "Platform Admin" : "Provider Organization"}
                </Badge>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">Crisis Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="What's happening? (e.g., Sylhet Monsoon Flooding)"
                  className="text-base"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about the crisis, affected areas, and immediate needs..."
                  className="min-h-32 text-base resize-none border-border/50 focus-visible:border-primary/50 transition-colors"
                  required
                />
              </div>

              {/* Image Upload Section - Facebook style collage */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Photos
                </Label>
                
                {/* Image collage preview */}
                {imagePreviews.length > 0 && (
                  <div className="mb-3 ring-1 ring-border/30 rounded-lg overflow-hidden">
                    {getImageCollageLayout()}
                  </div>
                )}

                {/* Upload button */}
                {selectedImages.length < 5 && (
                  <label 
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 p-6 border-2 border-dashed border-border/50 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      {selectedImages.length === 0 ? "Upload Crisis Photos (Up to 5)" : `Add More Photos (${selectedImages.length}/5)`}
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Crisis Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-linear-to-br from-muted/40 via-muted/20 to-transparent rounded-xl border border-border/30">
                <div className="space-y-2">
                  <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    Crisis Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as CrisisType }))}
                  >
                    <SelectTrigger id="type" className="border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CRISIS_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="division" className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    Division
                  </Label>
                  <Select
                    value={formData.division}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, division: value }))}
                  >
                    <SelectTrigger id="division" className="border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIVISIONS.map((division) => (
                        <SelectItem key={division} value={division}>
                          {division}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="severity" className="flex items-center justify-between text-sm font-medium">
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      Severity Level
                    </span>
                    <Badge variant="outline" className={getSeverityColor(formData.severity)}>
                      {formData.severity}/100
                    </Badge>
                  </Label>
                  <input
                    id="severity"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.severity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, severity: Number(e.target.value) }))}
                    className="w-full h-2.5 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                        rgb(34, 197, 94) 0%, 
                        rgb(234, 179, 8) 50%, 
                        rgb(239, 68, 68) 100%)`
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affected" className="flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4 text-primary" />
                    Affected Population
                  </Label>
                  <Input
                    id="affected"
                    type="number"
                    min="0"
                    value={formData.affectedPopulation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, affectedPopulation: Number(e.target.value) }))}
                    placeholder="Enter number of people affected"
                    className="border-border/50"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="funding" className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Estimated Funding Needed (৳)
                  </Label>
                  <Input
                    id="funding"
                    type="number"
                    min="0"
                    value={formData.fundingNeeded}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fundingNeeded: Number(e.target.value) }))}
                    placeholder="Enter estimated amount in BDT"
                    className="border-border/50"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-border/40">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  className="flex-1 h-11 text-base"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-11 text-base bg-primary hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20"
                >
                  Publish Crisis Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
