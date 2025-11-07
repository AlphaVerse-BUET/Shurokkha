"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Mail, Phone, MapPin, Edit2, Shield, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProfileImageUpload } from "@/components/profile/profile-image-upload"
import { ProofUpload } from "@/components/beneficiary/proof-upload"
import { MultipleProviderApplications } from "@/components/beneficiary/multiple-provider-applications"
import { useAppStore } from "@/store/app-store"
import { mockBeneficiaries, mockProviders } from "@/store/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function BeneficiaryProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser } = useAppStore()

  const beneficiaryData = mockBeneficiaries[0]

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: beneficiaryData.fullName,
    email: "amina@example.com",
    phone: beneficiaryData.phone,
    address: beneficiaryData.address,
    profileImage: beneficiaryData.profileImage,
    privacyMode: beneficiaryData.privacyMode,
  })

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    })
  }

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, profileImage: imageUrl }))
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
        </div>
        <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="gap-2">
          {isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileImageUpload
                currentImage={formData.profileImage}
                userName={formData.fullName}
                onImageChange={handleImageChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      className="pl-9"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">Application Status</p>
                    <Badge variant="secondary" className="mt-1">
                      {beneficiaryData.applicationStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <MultipleProviderApplications 
            beneficiary={beneficiaryData} 
            providers={mockProviders}
          />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control how your information is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="privacyMode">Privacy Mode</Label>
                <Select
                  value={formData.privacyMode}
                  onValueChange={(value: any) => setFormData((prev) => ({ ...prev, privacyMode: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="privacyMode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anonymous">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4" />
                        <span>Anonymous - Hide my name</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="limited">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>Limited - Show location only</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>Public - Show all details</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Control what information is visible to donors and providers
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <ProofUpload
            title="Crisis Proof Documents"
            description="Upload photos or videos proving your crisis situation. These help providers verify your case."
            existingProofs={beneficiaryData.crisisProofImages}
            maxFiles={5}
            onFilesChange={(files) => {
              console.log("New proof files uploaded:", files)
              // In production, this would upload to server
            }}
          />

          <Card>
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Document verification history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">National ID Card</p>
                    <p className="text-sm text-muted-foreground">Verified on {new Date(beneficiaryData.appliedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">Verified</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Crisis Proof Images</p>
                    <p className="text-sm text-muted-foreground">{beneficiaryData.crisisProofImages.length} documents uploaded</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white">AI Verified</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
