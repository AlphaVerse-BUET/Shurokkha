"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Building2, Mail, Phone, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/ai/file-upload"
import { useToast } from "@/hooks/use-toast"

export default function AdminAddProviderPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    organizationName: "",
    registrationType: "ngo",
    email: "",
    phone: "",
    websiteUrl: "",
    description: "",
    specialization: [] as string[],
    trustScore: 50,
  })

  const handleSubmit = () => {
    toast({
      title: "Provider Added",
      description: "New provider has been added successfully",
    })
    router.push("/admin/providers")
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold">Add New Provider</h1>
          <p className="text-muted-foreground">Manually register a new provider organization</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>Basic details about the provider organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="orgName"
                    value={formData.organizationName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, organizationName: e.target.value }))}
                    className="pl-9"
                    placeholder="Enter organization name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regType">Registration Type</Label>
                <Select
                  value={formData.registrationType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, registrationType: value }))}
                >
                  <SelectTrigger id="regType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="volunteer">Volunteer Organization</SelectItem>
                  </SelectContent>
                </Select>
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
                    className="pl-9"
                    placeholder="contact@organization.org"
                  />
                </div>
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
                    placeholder="+880-XX-XXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                    className="pl-9"
                    placeholder="https://organization.org"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the organization's mission and activities"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Verification Documents</CardTitle>
            <CardDescription>Upload required documents for AI verification</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10}
              maxFiles={10}
              aiValidation={true}
              validationType="document"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            Add Provider
          </Button>
        </div>
      </div>
    </div>
  )
}
