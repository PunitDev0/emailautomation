"use client"

import { useState } from "react"
import { X, Copy, Download, Check, Mail, Share2, FileText, Smartphone, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export default function ExportModal({ isOpen, onClose, emailData, templateName, blocks }) {
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState("email")
  const [emailService, setEmailService] = useState("mailchimp")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`Your email template "${templateName}" is ready!`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleDownload = () => {
    const data = {
      templateName,
      createdDate: new Date().toISOString(),
      totalElements: blocks.length,
      elements: emailData.elements,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${templateName.replace(/\s+/g, "-").toLowerCase()}-template.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEmailServiceExport = () => {
    // Simulate export to email service
    alert(`Your template will be exported to ${emailService}. This feature is coming soon!`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle>Export Your Email</DialogTitle>
                <p className="text-sm text-gray-600">Download or share your email template</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-0">
          <Tabs defaultValue="download" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="download" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Services</span>
              </TabsTrigger>
              <TabsTrigger value="share" className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="download" className="flex-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Template Summary</span>
                  </CardTitle>
                  <CardDescription>Your email template details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Template Name</Label>
                      <p className="text-lg font-semibold text-blue-600">{templateName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Total Elements</Label>
                      <p className="text-lg font-semibold">{emailData.totalElements}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Elements in Your Email</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {emailData.elements.map((element, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-medium">{element.type}</span>
                          <Badge variant="outline" className="text-xs">
                            {element.content.substring(0, 20)}...
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                    <Button onClick={handleCopy} variant="outline">
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="flex-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Export to Email Service</span>
                  </CardTitle>
                  <CardDescription>Send your template directly to your email marketing platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email-service">Choose Email Service</Label>
                    <Select value={emailService} onValueChange={setEmailService}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mailchimp">Mailchimp</SelectItem>
                        <SelectItem value="constantcontact">Constant Contact</SelectItem>
                        <SelectItem value="campaignmonitor">Campaign Monitor</SelectItem>
                        <SelectItem value="sendinblue">Sendinblue</SelectItem>
                        <SelectItem value="awsses">Amazon SES</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Your template will be formatted for {emailService}</li>
                      <li>• All images and links will be preserved</li>
                      <li>• Mobile responsiveness will be maintained</li>
                      <li>• You'll receive a confirmation email</li>
                    </ul>
                  </div>

                  <Button onClick={handleEmailServiceExport} className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Export to {emailService}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="share" className="flex-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>Share Your Template</span>
                  </CardTitle>
                  <CardDescription>Share with team members or clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="share-email">Email Address</Label>
                    <Input id="share-email" type="email" placeholder="colleague@company.com" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="share-message">Message (Optional)</Label>
                    <Input id="share-message" placeholder="Check out this email template I created!" className="mt-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Smartphone className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-medium">Mobile Preview</h4>
                      <p className="text-sm text-gray-600">Share mobile view</p>
                    </Card>
                    <Card className="p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Monitor className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <h4 className="font-medium">Desktop Preview</h4>
                      <p className="text-sm text-gray-600">Share desktop view</p>
                    </Card>
                  </div>

                  <Button className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Send Share Link
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
