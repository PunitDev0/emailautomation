"use client"

import { useState } from "react"
import { Save, Key, Mail, Shield, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // SMTP Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpEmail: "your@email.com",
    smtpPassword: "",
    smtpSecure: true,

    // Default Sender
    defaultFromName: "Your Company",
    defaultFromEmail: "noreply@yourcompany.com",
    defaultReplyTo: "support@yourcompany.com",

    // Email Settings
    unsubscribeFooter: true,
    trackOpens: true,
    trackClicks: true,

    // API Settings
    apiKey: "sk_live_1234567890abcdef",

    // General Settings
    timezone: "UTC",
    dateFormat: "YYYY-MM-DD",
    darkMode: true,
  })

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const generateApiKey = () => {
    const newKey =
      "sk_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSettings((prev) => ({ ...prev, apiKey: newKey }))
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <div className="space-y-8">
          {/* SMTP Configuration */}
          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-white" />
              <h2 className="text-lg font-semibold text-white">SMTP Configuration</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost" className="text-white">
                  SMTP Host
                </Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => handleInputChange("smtpHost", e.target.value)}
                  className="bg-black border-white/20 text-white"
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="smtpPort" className="text-white">
                  SMTP Port
                </Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => handleInputChange("smtpPort", e.target.value)}
                  className="bg-black border-white/20 text-white"
                  placeholder="587"
                />
              </div>
              <div>
                <Label htmlFor="smtpEmail" className="text-white">
                  SMTP Email
                </Label>
                <Input
                  id="smtpEmail"
                  type="email"
                  value={settings.smtpEmail}
                  onChange={(e) => handleInputChange("smtpEmail", e.target.value)}
                  className="bg-black border-white/20 text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword" className="text-white">
                  SMTP Password
                </Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => handleInputChange("smtpPassword", e.target.value)}
                  className="bg-black border-white/20 text-white"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="smtpSecure"
                  checked={settings.smtpSecure}
                  onCheckedChange={(checked) => handleInputChange("smtpSecure", checked)}
                />
                <Label htmlFor="smtpSecure" className="text-white">
                  Use TLS/SSL
                </Label>
              </div>
            </div>
          </div>

          {/* Default Sender Information */}
          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-white" />
              <h2 className="text-lg font-semibold text-white">Default Sender Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="defaultFromName" className="text-white">
                  Default From Name
                </Label>
                <Input
                  id="defaultFromName"
                  value={settings.defaultFromName}
                  onChange={(e) => handleInputChange("defaultFromName", e.target.value)}
                  className="bg-black border-white/20 text-white"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <Label htmlFor="defaultFromEmail" className="text-white">
                  Default From Email
                </Label>
                <Input
                  id="defaultFromEmail"
                  type="email"
                  value={settings.defaultFromEmail}
                  onChange={(e) => handleInputChange("defaultFromEmail", e.target.value)}
                  className="bg-black border-white/20 text-white"
                  placeholder="noreply@yourcompany.com"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="defaultReplyTo" className="text-white">
                  Default Reply-To Email
                </Label>
                <Input
                  id="defaultReplyTo"
                  type="email"
                  value={settings.defaultReplyTo}
                  onChange={(e) => handleInputChange("defaultReplyTo", e.target.value)}
                  className="bg-black border-white/20 text-white"
                  placeholder="support@yourcompany.com"
                />
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-white" />
              <h2 className="text-lg font-semibold text-white">Email Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Include Unsubscribe Footer</Label>
                  <p className="text-sm text-gray-400">Automatically add unsubscribe link to all emails</p>
                </div>
                <Switch
                  checked={settings.unsubscribeFooter}
                  onCheckedChange={(checked) => handleInputChange("unsubscribeFooter", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Track Email Opens</Label>
                  <p className="text-sm text-gray-400">Track when recipients open your emails</p>
                </div>
                <Switch
                  checked={settings.trackOpens}
                  onCheckedChange={(checked) => handleInputChange("trackOpens", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Track Link Clicks</Label>
                  <p className="text-sm text-gray-400">Track when recipients click links in your emails</p>
                </div>
                <Switch
                  checked={settings.trackClicks}
                  onCheckedChange={(checked) => handleInputChange("trackClicks", checked)}
                />
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-6 w-6 text-white" />
              <h2 className="text-lg font-semibold text-white">API Settings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKey" className="text-white">
                  API Key
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    value={settings.apiKey}
                    readOnly
                    className="bg-black border-white/20 text-white font-mono"
                  />
                  <Button
                    onClick={generateApiKey}
                    className="bg-black border border-white text-white hover:bg-white hover:text-black"
                  >
                    Generate New
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-1">Use this key to access the API programmatically</p>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="h-6 w-6 text-white" />
              <h2 className="text-lg font-semibold text-white">General Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone" className="text-white">
                  Timezone
                </Label>
                <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                  <SelectTrigger className="bg-black border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dateFormat" className="text-white">
                  Date Format
                </Label>
                <Select value={settings.dateFormat} onValueChange={(value) => handleInputChange("dateFormat", value)}>
                  <SelectTrigger className="bg-black border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between md:col-span-2">
                <div>
                  <Label className="text-white">Dark Mode</Label>
                  <p className="text-sm text-gray-400">Use dark theme for the interface</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleInputChange("darkMode", checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
