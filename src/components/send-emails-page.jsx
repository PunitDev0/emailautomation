"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Mail, Users, FileText, Eye, Send, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle,CardDescription  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";


const mockTemplates = [
  { id: "1", title: "Welcome Template", subject: "Welcome to {{company}}!" },
  { id: "2", title: "Product Launch Template", subject: "Exciting News: New Product Launch!" },
  { id: "3", title: "Newsletter Template", subject: "Monthly Newsletter - {{company}}" },
];

export function SendEmailsPage({ userRole }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [contactLists, setContactLists] = useState([]);
  const [selectedContactList, setSelectedContactList] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendResults, setSendResults] = useState(null);

  const steps = [
    { number: 1, title: "Select Contacts", icon: Users },
    { number: 2, title: "Choose Template", icon: FileText },
    { number: 3, title: "Configure Email", icon: Mail },
    { number: 4, title: "Preview & Send", icon: Eye },
  ];

  // Fetch contact lists on mount
  useEffect(() => {
    const fetchContactLists = async () => {
      try {
        const response = await fetch("/api/contacts/lists");
        if (!response.ok) {
          throw new Error("Failed to fetch contact lists");
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
    setSelectedTemplate(templateId);
    const template = mockTemplates.find((t) => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
    }
  };

  const handleSendEmails = async (scheduled = false) => {
    setIsSending(true);
    setSendProgress(0);

    try {
      if (!scheduled) {
        for (let i = 0; i <= 100; i += 10) {
          setSendProgress(i);
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      const response = await fetch("/api/emails/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        throw new Error(result.message || "Failed to send emails");
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
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedContactList !== "";
      case 2:
        return selectedTemplate !== "";
      case 3:
        return emailSubject !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedContactList("");
    setSelectedTemplate("");
    setEmailSubject("");
    setScheduleDate("");
    setSendResults(null);
    setSendProgress(0);
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Supercharge Your Email Campaigns
          </h2>
          <p className="text-lg text-gray-600 mt-1">
            Streamline outreach with AI-powered automation
          </p>
        </div>
        {userRole === "admin" && (
          <Badge
            variant="default"
            className="bg-purple-600 text-white flex items-center gap-1 hover:bg-purple-700"
          >
            <Mail className="w-4 h-4" />
            Admin Access
          </Badge>
        )}
      </div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <motion.div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                      currentStep >= step.number
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon className="w-6 h-6" />
                  </motion.div>
                  <div className="ml-4">
                    <p
                      className={`text-sm font-semibold ${
                        currentStep >= step.number ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      Step {step.number}
                    </p>
                    <p className="text-sm text-gray-600">{step.title}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-6 h-6 text-gray-400 mx-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Step Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentStep === 1 && "Select your audience for effortless outreach"}
              {currentStep === 2 && "Choose a template to boost engagement"}
              {currentStep === 3 && "Configure your email for maximum impact"}
              {currentStep === 4 && "Preview and launch your AI-powered campaign"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-700">Select Contact List</Label>
                <Select value={selectedContactList} onValueChange={setSelectedContactList}>
                  <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-purple-500">
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
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-100 rounded-lg"
                  >
                    <p className="text-sm font-medium text-blue-800">
                      Selected: {contactLists.find((l) => l.id === selectedContactList)?.name} (
                      {contactLists.find((l) => l.id === selectedContactList)?.count} contacts)
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <Label className="text-base font-semibold text-gray-700">Select Email Template</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTemplates.map((template) => (
                    <motion.div
                      key={template.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedTemplate === template.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                      onClick={() => handleTemplateSelect(template.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p className="font-medium text-gray-800">{template.title}</p>
                      <p className="text-sm text-gray-500">{template.subject}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="subject" className="text-base font-semibold text-gray-700">
                    Email Subject
                  </Label>
                  <Input
                    id="subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Enter email subject"
                    className="border-gray-300 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                {userRole === "admin" && (
                  <div>
                    <Label htmlFor="schedule" className="text-base font-semibold text-gray-700">
                      Schedule Send (Optional)
                    </Label>
                    <Input
                      id="schedule"
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately</p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                {!isSending && !sendResults && (
                  <div className="space-y-6">
                    <Card className="border-none bg-gradient-to-r from-blue-100 to-purple-100">
                      <CardContent className="pt-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Campaign Summary</h4>
                        <div className="text-sm space-y-2 text-gray-700">
                          <p>
                            <strong>Contact List:</strong>{" "}
                            {contactLists.find((l) => l.id === selectedContactList)?.name} (
                            {contactLists.find((l) => l.id === selectedContactList)?.count} contacts)
                          </p>
                          <p>
                            <strong>Template:</strong>{" "}
                            {mockTemplates.find((t) => t.id === selectedTemplate)?.title}
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
                      </CardContent>
                    </Card>
                    <Card className="border-none bg-white/90">
                      <CardContent className="pt-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Email Preview</h4>
                        <div className="text-sm text-gray-700">
                          <p>
                            <strong>To:</strong> example@domain.com
                          </p>
                          <p>
                            <strong>Subject:</strong>{" "}
                            {emailSubject.replace("{{company}}", "SocialSynk")}
                          </p>
                          <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-800">
                              Hello,
                              <br />
                              <br />
                              {mockTemplates.find((t) => t.id === selectedTemplate)?.title} content
                              goes here. Engage your audience with our AI-powered automation tools!
                              <br />
                              <br />
                              Best regards,
                              <br />
                              The SocialSynk Team
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {isSending && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 text-center"
                  >
                    <Mail className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-800">Sending Your Campaign...</h4>
                    <p className="text-sm text-gray-600">Please wait while we process your emails</p>
                    <Progress
                      value={sendProgress}
                      className="w-full h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-purple-600"
                    />
                    <p className="text-sm text-gray-600">{sendProgress}% complete</p>
                  </motion.div>
                )}

                {sendResults && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="text-center">
                      <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-800">Campaign Completed!</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="border-none bg-green-50">
                        <CardContent className="pt-6">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                              <p className="text-2xl font-bold text-green-600">{sendResults.sent}</p>
                              <p className="text-sm text-gray-600">Emails Sent</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-none bg-red-50">
                        <CardContent className="pt-6">
                          <div className="flex items-center space-x-3">
                            <XCircle className="w-6 h-6 text-red-600" />
                            <div>
                              <p className="text-2xl font-bold text-red-600">{sendResults.failed}</p>
                              <p className="text-sm text-gray-600">Failed</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={resetWizard}
                        variant="outline"
                        className="border-purple-500 text-purple-600 hover:bg-purple-50"
                      >
                        Send Another Campaign
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <div className="flex gap-3">
            {scheduleDate && userRole === "admin" && (
              <Button
                variant="outline"
                onClick={() => handleSendEmails(true)}
                disabled={isSending || sendResults !== null}
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            )}
            <Button
              onClick={() => handleSendEmails(false)}
              disabled={isSending || sendResults !== null}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSending ? "Sending..." : "Send Now"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}