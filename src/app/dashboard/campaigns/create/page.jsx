"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Eye, Send, Calendar, AlertCircle, CheckCircle, Globe, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const templates = [
  {
    id: 1,
    name: "Welcome Email",
    description: "Clean welcome template with CTA",
    category: "Welcome",
    preview: "Welcome to our platform! We're excited to have you on board...",
  },
  {
    id: 2,
    name: "Newsletter",
    description: "Weekly newsletter layout",
    category: "Newsletter",
    preview: "This week's highlights and important updates...",
  },
  {
    id: 3,
    name: "Product Launch",
    description: "Product announcement template",
    category: "Product",
    preview: "Introducing our latest product that will revolutionize...",
  },
  {
    id: 4,
    name: "Promotional",
    description: "Sales and discount template",
    category: "Promotional",
    preview: "Limited time offer! Get 50% off on all premium features...",
  },
]

const audiences = [
  { id: 1, name: "All Subscribers", count: 1250 },
  { id: 2, name: "VIP Customers", count: 89 },
  { id: 3, name: "Newsletter Subscribers", count: 756 },
  { id: 4, name: "Recent Signups", count: 234 },
]


export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [domainStatus, setDomainStatus] = useState(null)
  const [showDomainVerification, setShowDomainVerification] = useState(false)
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    fromName: "",
    fromEmail: "",
    replyTo: "",
    template: "",
    audience: "",
    sendType: "now",
  })
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof templates)[0] | null>(null)

  useEffect(() => {
    // Check domain verification status on component mount
    checkDomainStatus()
  }, [])

  const checkDomainStatus = async () => {
    // Simulate domain verification check
    setTimeout(() => {
      const mockDomainStatus = {
        domain: "yourcompany.com",
        status: Math.random() > 0.5 ? "verified" : "pending",
        dkim: Math.random() > 0.3,
        spf: Math.random() > 0.3,
        dmarc: Math.random() > 0.5,
      }
      setDomainStatus(mockDomainStatus)
    }, 1000)
  }

  const handleInputChange = (field, value) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    handleInputChange("template", template.id.toString())
  }

  const handleUseTemplate = (templateId) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      handleTemplateSelect(template)
      toast({
        title: "Template Selected",
        description: `Using ${template.name} template for your campaign`,
      })
    }
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!campaignData.name || !campaignData.subject) {
          toast({
            title: "Missing Information",
            description: "Please fill in campaign name and subject line",
            variant: "destructive",
          })
          return false
        }
        break
      case 2:
        if (!campaignData.fromName || !campaignData.fromEmail) {
          toast({
            title: "Missing Information",
            description: "Please fill in sender information",
            variant: "destructive",
          })
          return false
        }
        // Check domain verification
        if (domainStatus?.status !== "verified") {
          setShowDomainVerification(true)
          return false
        }
        break
      case 3:
        if (!campaignData.template) {
          toast({
            title: "Template Required",
            description: "Please select an email template",
            variant: "destructive",
          })
          return false
        }
        break
      case 4:
        if (!campaignData.audience) {
          toast({
            title: "Audience Required",
            description: "Please select your target audience",
            variant: "destructive",
          })
          return false
        }
        break
    }
    return true
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSendCampaign = () => {
    if (!validateStep(4)) return

    // Simulate campaign sending
    toast({
      title: "Campaign Sent!",
      description: `Your campaign "${campaignData.name}" has been sent successfully`,
    })

    // Redirect to campaigns page after a delay
    setTimeout(() => {
      window.location.href = "/"
    }, 2000)
  }

  const handleScheduleCampaign = () => {
    if (!validateStep(4) || !scheduleDate || !scheduleTime) {
      toast({
        title: "Missing Information",
        description: "Please select date and time for scheduling",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Campaign Scheduled!",
      description: `Your campaign will be sent on ${scheduleDate} at ${scheduleTime}`,
    })

    setTimeout(() => {
      window.location.href = "/"
    }, 2000)
  }

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your campaign has been saved as a draft",
    })
  }

  const verifyDomain = async () => {
    toast({
      title: "Verifying Domain",
      description: "Please wait while we verify your domain...",
    })

    // Simulate domain verification process
    setTimeout(() => {
      setDomainStatus((prev) => (prev ? { ...prev, status: "verified", dkim: true, spf: true, dmarc: true } : null))
      setShowDomainVerification(false)
      toast({
        title: "Domain Verified!",
        description: "Your domain has been successfully verified",
      })
    }, 3000)
  }

  const steps = [
    { id: 1, title: "Campaign Details", description: "Basic campaign information" },
    { id: 2, title: "Sender Info", description: "Configure sender details" },
    { id: 3, title: "Template", description: "Choose email template" },
    { id: 4, title: "Audience", description: "Select target audience" },
    { id: 5, title: "Review & Send", description: "Final review and send" },
  ]

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Campaign</h1>
            <p className="text-gray-400">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 p-4 border border-white/20 bg-white/5">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step.id ? "bg-white text-black" : "border-2 border-white/20 text-gray-400"
                }`}
              >
                {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              <div className="ml-3 hidden md:block">
                <p className={`text-sm font-medium ${currentStep >= step.id ? "text-white" : "text-gray-400"}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-white" : "bg-white/20"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Domain Verification Modal */}
        <Dialog open={showDomainVerification} onOpenChange={setShowDomainVerification}>
          <DialogContent className="bg-black border-2 border-white text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domain Verification Required
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border border-yellow-500/20 bg-yellow-500/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <p className="text-yellow-400 font-semibold">Domain Not Verified</p>
                </div>
                <p className="text-gray-300 text-sm">
                  To ensure high deliverability, please verify your sending domain before creating campaigns.
                </p>
              </div>

              {domainStatus && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-white/20 bg-white/5">
                    <span className="text-white">Domain: {domainStatus.domain}</span>
                    <Badge variant={domainStatus.status === "verified" ? "default" : "outline"}>
                      {domainStatus.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 border border-white/20 bg-white/5 text-center">
                      <p className="text-xs text-gray-400">DKIM</p>
                      <div className={`text-sm font-semibold ${domainStatus.dkim ? "text-green-400" : "text-red-400"}`}>
                        {domainStatus.dkim ? "✓ Valid" : "✗ Invalid"}
                      </div>
                    </div>
                    <div className="p-3 border border-white/20 bg-white/5 text-center">
                      <p className="text-xs text-gray-400">SPF</p>
                      <div className={`text-sm font-semibold ${domainStatus.spf ? "text-green-400" : "text-red-400"}`}>
                        {domainStatus.spf ? "✓ Valid" : "✗ Invalid"}
                      </div>
                    </div>
                    <div className="p-3 border border-white/20 bg-white/5 text-center">
                      <p className="text-xs text-gray-400">DMARC</p>
                      <div
                        className={`text-sm font-semibold ${domainStatus.dmarc ? "text-green-400" : "text-red-400"}`}
                      >
                        {domainStatus.dmarc ? "✓ Valid" : "✗ Invalid"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button onClick={verifyDomain} className="flex-1 bg-white text-black hover:bg-gray-200">
                  Verify Domain
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  onClick={() => setShowDomainVerification(false)}
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Step 1: Campaign Details */}
            {currentStep === 1 && (
              <Card className="bg-black border-2 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Campaign Name *
                    </Label>
                    <Input
                      id="name"
                      value={campaignData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-black border-white/20 text-white"
                      placeholder="Enter campaign name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-white">
                      Subject Line *
                    </Label>
                    <Input
                      id="subject"
                      value={campaignData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="bg-black border-white/20 text-white"
                      placeholder="Enter email subject"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Sender Information */}
            {currentStep === 2 && (
              <Card className="bg-black border-2 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Sender Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromName" className="text-white">
                        From Name *
                      </Label>
                      <Input
                        id="fromName"
                        value={campaignData.fromName}
                        onChange={(e) => handleInputChange("fromName", e.target.value)}
                        className="bg-black border-white/20 text-white"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fromEmail" className="text-white">
                        From Email *
                      </Label>
                      <Input
                        id="fromEmail"
                        type="email"
                        value={campaignData.fromEmail}
                        onChange={(e) => handleInputChange("fromEmail", e.target.value)}
                        className="bg-black border-white/20 text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="replyTo" className="text-white">
                      Reply-To Email
                    </Label>
                    <Input
                      id="replyTo"
                      type="email"
                      value={campaignData.replyTo}
                      onChange={(e) => handleInputChange("replyTo", e.target.value)}
                      className="bg-black border-white/20 text-white"
                      placeholder="reply@email.com"
                    />
                  </div>

                  {/* Domain Status */}
                  {domainStatus && (
                    <div
                      className={`p-4 border ${domainStatus.status === "verified" ? "border-green-500/20 bg-green-500/10" : "border-yellow-500/20 bg-yellow-500/10"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {domainStatus.status === "verified" ? (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-400" />
                        )}
                        <p
                          className={`font-semibold ${domainStatus.status === "verified" ? "text-green-400" : "text-yellow-400"}`}
                        >
                          Domain {domainStatus.status === "verified" ? "Verified" : "Verification Pending"}
                        </p>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {domainStatus.status === "verified"
                          ? "Your domain is verified and ready for sending emails."
                          : "Domain verification is required for optimal email delivery."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Template Selection */}
            {currentStep === 3 && (
              <Card className="bg-black border-2 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Select Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={`border-2 p-4 cursor-pointer transition-colors ${
                          selectedTemplate?.id === template.id
                            ? "border-white bg-white/10"
                            : "border-white/20 hover:border-white/40"
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white font-semibold">{template.name}</h3>
                            <p className="text-gray-400 text-sm">{template.description}</p>
                          </div>
                          <Badge variant="outline" className="border-white/20 text-gray-300 text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="flex-1 bg-black border border-white text-white hover:bg-white hover:text-black"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-black border-white text-white max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{template.name} - Preview</DialogTitle>
                              </DialogHeader>
                              <div className="border border-white/20 bg-white text-black p-8 min-h-96">
                                <p>{template.preview}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            className="flex-1 bg-white text-black hover:bg-gray-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUseTemplate(template.id)
                            }}
                          >
                            Use Template
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Audience Selection */}
            {currentStep === 4 && (
              <Card className="bg-black border-2 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Select Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {audiences.map((audience) => (
                      <div
                        key={audience.id}
                        className={`border-2 p-4 cursor-pointer transition-colors ${
                          campaignData.audience === audience.id.toString()
                            ? "border-white bg-white/10"
                            : "border-white/20 hover:border-white/40"
                        }`}
                        onClick={() => handleInputChange("audience", audience.id.toString())}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-white font-semibold">{audience.name}</h3>
                            <p className="text-gray-400 text-sm">{audience.count.toLocaleString()} subscribers</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold text-lg">{audience.count.toLocaleString()}</p>
                            <p className="text-gray-400 text-xs">recipients</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Review & Send */}
            {currentStep === 5 && (
              <Card className="bg-black border-2 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Review Your Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-white/20 p-3 bg-white/5">
                      <p className="text-gray-400 text-sm">Campaign Name</p>
                      <p className="text-white font-semibold">{campaignData.name}</p>
                    </div>
                    <div className="border border-white/20 p-3 bg-white/5">
                      <p className="text-gray-400 text-sm">Subject Line</p>
                      <p className="text-white font-semibold">{campaignData.subject}</p>
                    </div>
                    <div className="border border-white/20 p-3 bg-white/5">
                      <p className="text-gray-400 text-sm">From</p>
                      <p className="text-white font-semibold">
                        {campaignData.fromName} &lt;{campaignData.fromEmail}&gt;
                      </p>
                    </div>
                    <div className="border border-white/20 p-3 bg-white/5">
                      <p className="text-gray-400 text-sm">Template</p>
                      <p className="text-white font-semibold">{selectedTemplate?.name || "Not selected"}</p>
                    </div>
                    <div className="border border-white/20 p-3 bg-white/5">
                      <p className="text-gray-400 text-sm">Audience</p>
                      <p className="text-white font-semibold">
                        {audiences.find((a) => a.id.toString() === campaignData.audience)?.name || "Not selected"}
                      </p>
                    </div>
                    <div className="border border-white/20 p-3 bg-white/5">
                      <p className="text-gray-400 text-sm">Recipients</p>
                      <p className="text-white font-semibold">
                        {audiences.find((a) => a.id.toString() === campaignData.audience)?.count.toLocaleString() ||
                          "0"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation */}
            <Card className="bg-black border-2 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <Button
                    onClick={handlePrevStep}
                    disabled={currentStep === 1}
                    className="bg-black border border-white text-white hover:bg-white hover:text-black disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  {currentStep < 5 ? (
                    <Button onClick={handleNextStep} className="bg-white text-black hover:bg-gray-200">
                      Next
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Send Options */}
            {currentStep === 5 && (
              <Card className="bg-black border-2 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Send Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="sendNow"
                        name="sendType"
                        value="now"
                        checked={campaignData.sendType === "now"}
                        onChange={(e) => handleInputChange("sendType", e.target.value)}
                        className="text-white"
                      />
                      <Label htmlFor="sendNow" className="text-white">
                        Send Now
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="schedule"
                        name="sendType"
                        value="schedule"
                        checked={campaignData.sendType === "schedule"}
                        onChange={(e) => handleInputChange("sendType", e.target.value)}
                        className="text-white"
                      />
                      <Label htmlFor="schedule" className="text-white">
                        Schedule
                      </Label>
                    </div>

                    {campaignData.sendType === "schedule" && (
                      <div className="space-y-3 ml-6">
                        <div>
                          <Label htmlFor="scheduleDate" className="text-white">
                            Date
                          </Label>
                          <Input
                            id="scheduleDate"
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="bg-black border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="scheduleTime" className="text-white">
                            Time
                          </Label>
                          <Input
                            id="scheduleTime"
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="bg-black border-white/20 text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={campaignData.sendType === "now" ? handleSendCampaign : handleScheduleCampaign}
                      className="w-full bg-black border-2 border-white text-white hover:bg-white hover:text-black"
                    >
                      {campaignData.sendType === "now" ? (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Campaign
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleSaveDraft}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      Save as Draft
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-black border-2 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleSaveDraft}
                  className="w-full bg-black border border-white text-white hover:bg-white hover:text-black"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Test Email",
                      description: "Test email sent to your address",
                    })
                  }}
                  className="w-full bg-black border border-white text-white hover:bg-white hover:text-black"
                >
                  Send Test Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
