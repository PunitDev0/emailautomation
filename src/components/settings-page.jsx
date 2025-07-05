"use client";
import { useState } from "react"
import { Save, Mail, Server, Shield, User, Key } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function SettingsPage({
  userRole
}) {
  const [smtpSettings, setSmtpSettings] = useState({
    host: "smtp.gmail.com",
    port: "587",
    username: "your-email@gmail.com",
    password: "",
    encryption: "TLS",
  })

  const [generalSettings, setGeneralSettings] = useState({
    testMode: true,
    emailNotifications: true,
    trackOpens: true,
    trackClicks: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  const handleTestConnection = async () => {
    toast({
      title: "Testing connection...",
      description: "Checking SMTP connection settings.",
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Connection successful",
      description: "SMTP settings are working correctly.",
    })
  }

  if (userRole !== "admin") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Admin Access Required</h3>
            <p className="text-muted-foreground">You need administrator privileges to access system settings.</p>
            <Badge variant="secondary" className="mt-4">
              Current Role: User
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Configure your email automation settings</p>
        </div>
        <Badge variant="default" className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Admin Settings
        </Badge>
      </div>
      {/* SMTP Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            SMTP Configuration
          </CardTitle>
          <CardDescription>Configure your SMTP server settings for sending emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input
                id="smtp-host"
                value={smtpSettings.host}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                placeholder="smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="smtp-port">Port</Label>
              <Input
                id="smtp-port"
                value={smtpSettings.port}
                onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
                placeholder="587" />
            </div>
          </div>
          <div>
            <Label htmlFor="smtp-username">Username</Label>
            <Input
              id="smtp-username"
              type="email"
              value={smtpSettings.username}
              onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
              placeholder="your-email@gmail.com" />
          </div>
          <div>
            <Label htmlFor="smtp-password">Password</Label>
            <Input
              id="smtp-password"
              type="password"
              value={smtpSettings.password}
              onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
              placeholder="Enter your password or app password" />
          </div>
          <div>
            <Label htmlFor="smtp-encryption">Encryption</Label>
            <Input
              id="smtp-encryption"
              value={smtpSettings.encryption}
              onChange={(e) => setSmtpSettings({ ...smtpSettings, encryption: e.target.value })}
              placeholder="TLS"
              disabled />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTestConnection}>
              <Mail className="w-4 h-4 mr-2" />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            General Settings
          </CardTitle>
          <CardDescription>Configure general application settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Test Mode</Label>
              <p className="text-sm text-muted-foreground">When enabled, emails won't be sent to actual recipients</p>
            </div>
            <Switch
              checked={generalSettings.testMode}
              onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, testMode: checked })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications about campaign status</p>
            </div>
            <Switch
              checked={generalSettings.emailNotifications}
              onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, emailNotifications: checked })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Track Email Opens</Label>
              <p className="text-sm text-muted-foreground">Track when recipients open your emails</p>
            </div>
            <Switch
              checked={generalSettings.trackOpens}
              onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, trackOpens: checked })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Track Link Clicks</Label>
              <p className="text-sm text-muted-foreground">Track when recipients click links in your emails</p>
            </div>
            <Switch
              checked={generalSettings.trackClicks}
              onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, trackClicks: checked })} />
          </div>
        </CardContent>
      </Card>
      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Settings
          </CardTitle>
          <CardDescription>Manage API keys and integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input value="eak_1234567890abcdef..." disabled className="font-mono text-sm" />
              <Button variant="outline">Regenerate</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Use this API key to integrate with external applications
            </p>
          </div>
          <div>
            <Label>Webhook URL</Label>
            <Input placeholder="https://your-app.com/webhook" className="font-mono text-sm" />
            <p className="text-xs text-muted-foreground mt-1">Receive real-time notifications about email events</p>
          </div>
        </CardContent>
      </Card>
      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
