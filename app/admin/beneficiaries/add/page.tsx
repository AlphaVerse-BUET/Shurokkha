"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, Phone, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ai/file-upload"
import { useToast } from "@/hooks/use-toast"

export default function AdminAddBeneficiaryPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    nidNumber: "",
    phone: "",
    address: "",
    needCategory: "shelter",
    amountRequested: "",
    urgencyLevel: "high",
    needDescription: "",
  })

  const handleSubmit = () => {
    toast({
      title: "Beneficiary Added",
      description: "New beneficiary has been added successfully",
    })
    router.push("/admin/beneficiaries")
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold">Add New Beneficiary</h1>
          <p className="text-muted-foreground">Manually register a new beneficiary</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the beneficiary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="pl-9"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nid">NID Number</Label>
                <Input
                  id="nid"
                  value={formData.nidNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nidNumber: e.target.value }))}
                  placeholder="13-digit NID number"
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
                    className="pl-9"
                    placeholder="+880XXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select
                  value={formData.urgencyLevel}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, urgencyLevel: value }))}
                >
                  <SelectTrigger id="urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    className="pl-9"
                    rows={2}
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need Information</CardTitle>
            <CardDescription>Details about the assistance needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Need Category</Label>
                <Select
                  value={formData.needCategory}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, needCategory: value }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shelter">Shelter</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="livelihood">Livelihood</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount Requested (BDT)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amountRequested}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amountRequested: e.target.value }))}
                    className="pl-9"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Need Description</Label>
                <Textarea
                  id="description"
                  value={formData.needDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, needDescription: e.target.value }))}
                  rows={4}
                  placeholder="Describe the specific need and circumstances"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
            <CardDescription>Upload NID and proof documents for AI verification</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={5}
              maxFiles={10}
              aiValidation={true}
              validationType="nid"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            Add Beneficiary
          </Button>
        </div>
      </div>
    </div>
  )
}
