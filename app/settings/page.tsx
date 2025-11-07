"use client"

import { useState } from "react"
import { useAppStore } from "@/store/app-store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Lock, Globe, Shield, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { currentUser, currentRole } = useAppStore()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [showDonationHistory, setShowDonationHistory] = useState(false)

  // Security settings
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSaveNotifications = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      })
    }, 1000)
  }

  const handleSavePrivacy = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Settings saved",
        description: "Your privacy settings have been updated.",
      })
    }, 1000)
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      })
    }, 1000)
  }

  if (!currentUser) {
    router.push("/auth/login")
    return null
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-accent/5">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-foreground/60 mt-1">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="language">
              <Globe className="w-4 h-4 mr-2" />
              Language
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via SMS</p>
                  </div>
                  <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <Button onClick={handleSaveNotifications} disabled={loading}>
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your data visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="profile-visibility">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                  </div>
                  <Switch id="profile-visibility" checked={profileVisibility} onCheckedChange={setProfileVisibility} />
                </div>

                {currentRole === "donor" && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="donation-history">Show Donation History</Label>
                      <p className="text-sm text-muted-foreground">Display your donations on leaderboard</p>
                    </div>
                    <Switch
                      id="donation-history"
                      checked={showDonationHistory}
                      onCheckedChange={setShowDonationHistory}
                    />
                  </div>
                )}

                <Button onClick={handleSavePrivacy} disabled={loading}>
                  {loading ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                <Button onClick={handleChangePassword} disabled={loading}>
                  {loading ? "Changing..." : "Change Password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language Tab */}
          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle>Language Preferences</CardTitle>
                <CardDescription>Choose your preferred language</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Language</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start bg-transparent">
                      English (US)
                    </Button>
                    <Button variant="outline" className="justify-start opacity-50 bg-transparent" disabled>
                      বাংলা (Coming Soon)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
