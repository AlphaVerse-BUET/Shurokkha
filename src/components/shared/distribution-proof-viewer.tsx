"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  MapPin,
  Calendar,
  Image as ImageIcon,
  Video,
  FileText,
  AlertCircle,
  Eye,
  X,
} from "lucide-react"
import { DistributionProof } from "@/types"

interface DistributionProofViewerProps {
  proof: DistributionProof
  beneficiaryName?: string
  showAIVerification?: boolean
}

export function DistributionProofViewer({ proof, beneficiaryName, showAIVerification = true }: DistributionProofViewerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState("photos")

  const allPhotos = [
    ...proof.preSiteVisitPhotos.map(p => ({ url: p, type: "Pre-Visit" })),
    ...proof.distributionPhotos.map(p => ({ url: p, type: "Distribution" })),
    ...proof.postDistributionPhotos.map(p => ({ url: p, type: "Post-Distribution" })),
  ]

  return (
    <div className="space-y-6">
      {/* Header with AI Verification Status */}
      {showAIVerification && (
        <Card className={`border-2 ${proof.verificationStatus === "verified" ? "border-green-500/50 bg-green-500/5" : "border-yellow-500/50 bg-yellow-500/5"}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {proof.verificationStatus === "verified" ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                )}
                AI Verification Status
              </CardTitle>
              <Badge className={proof.verificationStatus === "verified" ? "bg-green-600" : "bg-yellow-600"}>
                {proof.verificationStatus.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Face Match</p>
                <p className="text-2xl font-bold text-green-600">{proof.faceMatchScore}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">GPS Validation</p>
                <p className="text-lg font-semibold">
                  {proof.gpsValidation ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-red-600">✗ Failed</span>
                  )}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Image Quality</p>
                <p className="text-2xl font-bold text-blue-600">{proof.imageQualityScore}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Deepfake Check</p>
                <p className="text-lg font-semibold">
                  {proof.deepfakeDetection ? (
                    <span className="text-green-600">✓ Passed</span>
                  ) : (
                    <span className="text-red-600">✗ Detected</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distribution Details */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution Information</CardTitle>
          <CardDescription>
            {beneficiaryName && `Distribution to ${beneficiaryName}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Distribution Date</p>
                <p className="font-semibold">{new Date(proof.distributionDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">GPS Coordinates</p>
                <p className="font-semibold text-xs">
                  {proof.gpsCoordinates.lat.toFixed(4)}, {proof.gpsCoordinates.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>

          {/* Items Distributed */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Items Distributed
            </h4>
            <div className="space-y-1">
              {proof.itemsVerified.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                  <span>{item.item}</span>
                  <span className="font-medium">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmations */}
          <div className="flex gap-4 pt-2">
            <Badge variant={proof.beneficiaryConsentForm ? "default" : "secondary"} className="gap-1">
              {proof.beneficiaryConsentForm ? <CheckCircle className="h-3 w-3" /> : <X className="h-3 w-3" />}
              Consent Form
            </Badge>
            <Badge variant={proof.beneficiaryConfirmationSMS ? "default" : "secondary"} className="gap-1">
              {proof.beneficiaryConfirmationSMS ? <CheckCircle className="h-3 w-3" /> : <X className="h-3 w-3" />}
              SMS Confirmation
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution Proof Gallery</CardTitle>
          <CardDescription>Photos and videos documenting the distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="photos" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Photos ({allPhotos.length})
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                Videos ({proof.distributionVideos.length})
              </TabsTrigger>
              <TabsTrigger value="documents" className="gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allPhotos.map((photo, idx) => (
                  <div key={idx} className="relative group cursor-pointer" onClick={() => setSelectedImage(photo.url)}>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                      <img
                        src={photo.url}
                        alt={`${photo.type} ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <Badge className="absolute top-2 left-2 text-xs" variant="secondary">
                      {photo.type}
                    </Badge>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-4">
              {proof.distributionVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proof.distributionVideos.map((video, idx) => (
                    <div key={idx} className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-border">
                      <video controls className="w-full h-full">
                        <source src={video} type="video/mp4" />
                        Your browser does not support video playback.
                      </video>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No videos uploaded</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-4">
              <div className="space-y-4">
                {proof.receiptImages.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Receipts</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {proof.receiptImages.map((receipt, idx) => (
                        <div key={idx} className="relative group cursor-pointer" onClick={() => setSelectedImage(receipt)}>
                          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                            <img
                              src={receipt}
                              alt={`Receipt ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {proof.bankTransferScreenshots && proof.bankTransferScreenshots.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Bank Transfer Proof</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {proof.bankTransferScreenshots.map((screenshot, idx) => (
                        <div key={idx} className="relative group cursor-pointer" onClick={() => setSelectedImage(screenshot)}>
                          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border-2 border-border hover:border-primary transition-colors">
                            <img
                              src={screenshot}
                              alt={`Bank Transfer ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Signature</h4>
                  <div className="max-w-xs">
                    <img
                      src={proof.beneficiarySignature}
                      alt="Beneficiary Signature"
                      className="w-full border-2 border-border rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
      )}
    </div>
  )
}
