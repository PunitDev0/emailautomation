"use client";
import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, Mail, Users, FileText, Eye, Send, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

const mockTemplates = [
  { id: "1", title: "Welcome Template", subject: "Welcome to {{company}}!" },
  { id: "2", title: "Product Launch Template", subject: "Exciting News: New Product Launch!" },
  { id: "3", title: "Newsletter Template", subject: "Monthly Newsletter - {{company}}" },
]

export function SendEmailsPage({ userRole }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [contactLists, setContactLists] = useState([])
  const [selectedContactList, setSelectedContactList] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [scheduleDate, setScheduleDate] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendProgress, setSendProgress] = useState(0)
  const [sendResults, setSendResults] = useState(null)

  const steps = [
    { number: 1, title: "Select Contacts", icon: Users },
    { number: 2, title: "Choose Template", icon: FileText },
    { number: 3, title: "Configure Email", icon: Mail },
    { number: 4, title: "Preview & Send", icon: Eye },
  ]

  // Fetch contact lists on mount
  useEffect(() => {
    const fetchContactLists = async () => {
      try {
        const response = await fetch('/api/contacts/lists');
        if (!response.ok) {
          throw new Error('Failed to fetch contact lists');
        }
        const lists = await response.json();
        setContactLists(lists);
      } catch (error) {
        toast({
          title: "Error fetching contact lists",
          description: error.message,
          variant: "destructive",
        });
      }
    };
    fetchContactLists();
  }, []);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
    const template = mockTemplates.find((t) => t.id === templateId)
    if (template) {
      setEmailSubject(template.subject)
    }
  }

  const handleSendEmails = async (scheduled = false) => {
    setIsSending(true)
    setSendProgress(0)

    try {
      // Simulate progress for immediate sending
      if (!scheduled) {
        for (let i = 0; i <= 100; i += 10) {
          setSendProgress(i)
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }

      const response = await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listName: contactLists.find((l) => l.id === selectedContactList)?.name,
          subject: emailSubject,
          templateId: selectedTemplate,
          scheduleDate: scheduled ? scheduleDate : undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (scheduled) {
          toast({
            title: "Email scheduled",
            description: `Your email campaign has been scheduled for ${new Date(scheduleDate).toLocaleDateString()}.`,
          });
        } else {
          setSendResults({ sent: result.sent, failed: result.failed });
          toast({
            title: "Email campaign completed",
            description: `${result.sent} emails sent successfully, ${result.failed} failed.`,
          });
        }
      } else {
        throw new Error(result.message || 'Failed to send emails');
      }
    } catch (error) {
      toast({
        title: "Error sending emails",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedContactList !== ""
      case 2:
        return selectedTemplate !== ""
      case 3:
        return emailSubject !== ""
      case 4:
        return true
      default:
        return false
    }
  }

  const resetWizard = () => {
    setCurrentStep(1)
    setSelectedContactList("")
    setSelectedTemplate("")
    setEmailSubject("")
    setScheduleDate("")
    setSendResults(null)
    setSendProgress(0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Send Emails</h2>
          <p className="text-muted-foreground">Create and send email campaigns to your contacts</p>
        </div>
        {userRole === "admin" && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Admin Access
          </Badge>
        )}
      </div>
      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${currentStep >= step.number ? "text-blue-600" : "text-gray-500"}`}>
                    Step {step.number}
                  </p>
                  <p className="text-sm text-gray-500">{step.title}</p>
                </div>
                {index < steps.length - 1 && <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Choose which contacts to send emails to"}
            {currentStep === 2 && "Select an email template for your campaign"}
            {currentStep === 3 && "Configure your email settings"}
            {currentStep === 4 && "Review and send your email campaign"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label>Select Contact List</Label>
              <Select value={selectedContactList} onValueChange={setSelectedContactList}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a contact list" />
                </SelectTrigger>
                <SelectContent>
                  {contactLists.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name} ({list.count} contacts)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedContactList && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Selected: {contactLists.find((l) => l.id === selectedContactList)?.name} (
                    {contactLists.find((l) => l.id === selectedContactList)?.count} contacts)
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>Select Email Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an email template" />
                </SelectTrigger>
                <SelectContent>
                  {mockTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Selected: {mockTemplates.find((t) => t.id === selectedTemplate)?.title}
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject" />
              </div>
              {userRole === "admin" && (
                <div>
                  <Label htmlFor="schedule">Schedule Send (Optional)</Label>
                  <Input
                    id="schedule"
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)} />
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to send immediately</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              {!isSending && !sendResults && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Campaign Summary</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Contact List:</strong>{" "}
                        {contactLists.find((l) => l.id === selectedContactList)?.name} (
                        {contactLists.find((l) => l.id === selectedContactList)?.count} contacts)
                      </p>
                      <p>
                        <strong>Template:</strong> {mockTemplates.find((t) => t.id === selectedTemplate)?.title}
                      </p>
                      <p>
                        <strong>Subject:</strong> {emailSubject}
                      </p>
                      {scheduleDate && (
                        <p>
                          <strong>Scheduled for:</strong> {new Date(scheduleDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Sample Email Preview</h4>
                    <div className="text-sm">
                      <p>
                        <strong>To:</strong> example@domain.com
                      </p>
                      <p>
                        <strong>Subject:</strong> {emailSubject.replace('{{company}}', 'Our Company')}
                      </p>
                      <div className="mt-2 p-3 bg-white rounded border">
                        Hello Example,
                        <br />
                        <br />
                        {mockTemplates.find((t) => t.id === selectedTemplate)?.title} content goes here.
                        <br />
                        <br />
                        Best regards,
                        <br />
                        The Team
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isSending && (
                <div className="space-y-4">
                  <div className="text-center">
                    <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h4 className="font-medium">Sending Emails...</h4>
                    <p className="text-sm text-muted-foreground">Please wait while we send your campaign</p>
                  </div>
                  <Progress value={sendProgress} className="w-full" />
                  <p className="text-center text-sm">{sendProgress}% complete</p>
                </div>
              )}

              {sendResults && (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h4 className="font-medium">Campaign Completed!</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="text-2xl font-bold text-green-600">{sendResults.sent}</p>
                            <p className="text-sm text-muted-foreground">Emails Sent</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                          <XCircle className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="text-2xl font-bold text-red-600">{sendResults.failed}</p>
                            <p className="text-sm text-muted-foreground">Failed</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="text-center">
                    <Button onClick={resetWizard} variant="outline">
                      Send Another Campaign
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button onClick={nextStep} disabled={!canProceed()}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="flex gap-2">
            {scheduleDate && userRole === "admin" && (
              <Button
                variant="outline"
                onClick={() => handleSendEmails(true)}
                disabled={isSending || sendResults !== null}>
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            )}
            <Button
              onClick={() => handleSendEmails(false)}
              disabled={isSending || sendResults !== null}>
              <Send className="w-4 h-4 mr-2" />
              {isSending ? "Sending..." : "Send Now"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}