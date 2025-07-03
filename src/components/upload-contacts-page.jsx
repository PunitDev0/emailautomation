"use client";
import { useState } from "react"
import { Upload, FileText, Check, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

const mockContactData = [
  { name: "Alice Roy", email: "alice@example.com", company: "TechCorp", custom1: "Alpha", custom2: "India" },
  { name: "John Doe", email: "john@example.com", company: "DevHouse", custom1: "Beta", custom2: "USA" },
  { name: "Jane Smith", email: "jane@example.com", company: "CloudBase", custom1: "Gamma", custom2: "UK" },
  { name: "Bob Wilson", email: "bob@example.com", company: "StartupXYZ", custom1: "Delta", custom2: "Canada" },
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    company: "InnovateLab",
    custom1: "Epsilon",
    custom2: "Australia",
  },
  { name: "Mike Chen", email: "mike@example.com", company: "DataFlow", custom1: "Zeta", custom2: "Singapore" },
]

export function UploadContactsPage() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setShowPreview(true)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been processed and is ready for preview.`,
      })
    }
  }

  const handleSaveContacts = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSaving(false)
    toast({
      title: "Contacts saved successfully",
      description: `${mockContactData.length} contacts have been saved to your database.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Upload Contacts</h2>
          <p className="text-muted-foreground">Upload your contact list from CSV or Excel files</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{showPreview ? mockContactData.length : 0} contacts loaded</span>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Select a CSV or Excel file containing your contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV or XLSX files only (MAX. 10MB)</p>
              </div>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload} />
            </label>
          </div>
          {uploadedFile && (
            <div
              className="mt-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-800 flex-1">{uploadedFile.name}</span>
              <Check className="w-4 h-4 text-green-600" />
            </div>
          )}
        </CardContent>
      </Card>
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Preview</CardTitle>
            <CardDescription>
              Preview of your uploaded contacts ({mockContactData.length} records found)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Custom1</TableHead>
                    <TableHead>Custom2</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockContactData.map((contact, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{contact.custom1}</TableCell>
                      <TableCell>{contact.custom2}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">All contacts will be added to your default contact list</p>
              <Button onClick={handleSaveContacts} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Contacts"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
