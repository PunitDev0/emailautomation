"use client";
import { useState } from "react";
import { Upload, FileText, Check, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export function UploadContactsPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contactData, setContactData] = useState([]);
  const [listName, setListName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const formattedData = jsonData.map(row => ({
          name: row.Name && row.Name.trim() ? row.Name : 'Unknown',
          email: row.Email || '',
          company: row.Company || '',
          custom1: row.Custom1 || '',
          custom2: row.Custom2 || ''
        }));

        setContactData(formattedData);
        setShowPreview(true);

        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been processed with ${formattedData.length} contacts.`,
        });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSaveContacts = async () => {
    if (!listName.trim()) {
      toast({
        title: "List name required",
        description: "Please enter a name for the contact list.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/contacts/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contacts: contactData, listName }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Contacts saved successfully",
          description: `${result.count} contacts have been saved to list "${result.listName}".`,
        });
        setListName("");
        setUploadedFile(null);
        setShowPreview(false);
        setContactData([]);
      } else {
        throw new Error(result.message || 'Failed to save contacts');
      }
    } catch (error) {
      toast({
        title: "Error saving contacts",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 overflow-hidden text-gray-900" style={{ background: 'transparent' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-purple-400/20 rounded-full blur-3xl animate-moveFromLeft"></div>
        <div className="absolute left-[50%] w-80 h-80 bg-gradient-to-br from-green-400/20 via-teal-500/20 to-blue-400/20 rounded-full blur-3xl animate-moveFromRight"></div>
        <div className="absolute left-0 w-72 h-72 bg-gradient-to-br from-pink-400/20 via-red-500/20 to-orange-400/20 rounded-full blur-3xl animate-moveFromCenter"></div>
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-800">Upload Contacts</h2>
            <p className="text-sm text-gray-600">Upload your contact list from CSV or Excel files</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{showPreview ? contactData.length : 0} contacts loaded</span>
          </div>
        </div>
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>Select a CSV or Excel file containing your contact information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV or XLSX files only (MAX. 10MB)</p>
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
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Contact Preview</CardTitle>
              <CardDescription>
                Preview of your uploaded contacts ({contactData.length} records found)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="list-name" className="block text-sm font-medium text-gray-700">
                  List Name
                </label>
                <Input
                  id="list-name"
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Enter a name for this contact list"
                  className="mt-1 border-gray-300"
                />
              </div>
              <div className="rounded-md border border-gray-200 overflow-hidden">
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
                    {contactData.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-gray-800">{contact.name}</TableCell>
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
                <p className="text-sm text-gray-600">All contacts will be added to the specified list</p>
                <Button
                  onClick={handleSaveContacts}
                  disabled={isSaving || !listName.trim()}
                  className="bg-black text-white hover:bg-gray-800">
                  {isSaving ? "Saving..." : "Save Contacts"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <style>
        {`
          @keyframes moveFromLeft {
            0% { transform: translate(-100%, 0%) scale(1); }
            25% { transform: translate(50%, -50%) scale(1.2); }
            50% { transform: translate(100%, 50%) scale(1.1); }
            75% { transform: translate(0%, 100%) scale(1.3); }
            100% { transform: translate(-100%, 0%) scale(1); }
          }
          @keyframes moveFromRight {
            0% { transform: translate(100%, 0%) scale(1); }
            25% { transform: translate(-50%, 50%) scale(1.2); }
            50% { transform: translate(-100%, -50%) scale(1.1); }
            75% { transform: translate(0%, -100%) scale(1.3); }
            100% { transform: translate(100%, 0%) scale(1); }
          }
          @keyframes moveFromCenter {
            0% { transform: translate(0%, 0%) scale(1); }
            25% { transform: translate(50%, 50%) scale(1.2); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            75% { transform: translate(0%, 100%) scale(1.3); }
            100% { transform: translate(0%, 0%) scale(1); }
          }
          .animate-moveFromLeft { animation: moveFromLeft 20s ease-in-out infinite; }
          .animate-moveFromRight { animation: moveFromRight 22s ease-in-out infinite; }
          .animate-moveFromCenter { animation: moveFromCenter 18s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}