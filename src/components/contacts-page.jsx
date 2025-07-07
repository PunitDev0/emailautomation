"use client";
import { useState } from "react";
import { Search, Filter, Edit, Trash2, Mail, Download, UserPlus, Tag, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const mockContacts = [
  // ... (unchanged mock data)
];

const contactLists = [
  // ... (unchanged contact lists)
];

export function ContactsPage({ userRole }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedList, setSelectedList] = useState("all");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    company: "",
    tags: "",
  });

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesList =
      selectedList === "all" ||
      (selectedList === "active" && contact.status === "Active") ||
      (selectedList === "vip" && contact.tags.includes("VIP")) ||
      (selectedList === "tech" && contact.tags.includes("Tech")) ||
      (selectedList === "inactive" && contact.status === "Inactive");

    return matchesSearch && matchesList;
  });

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    );
  };

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === filteredContacts.length ? [] : filteredContacts.map((c) => c.id)
    );
  };

  const handleAddContact = () => {
    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your contacts.`,
    });
    setNewContact({ name: "", email: "", company: "", tags: "" });
    setIsAddContactOpen(false);
  };

  const handleBulkAction = (action) => {
    toast({
      title: `Bulk action: ${action}`,
      description: `Applied ${action} to ${selectedContacts.length} contacts.`,
    });
    setSelectedContacts([]);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "Bounced":
        return <Badge variant="destructive">Bounced</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getEngagementBadge = (engagement) => {
    switch (engagement) {
      case "High":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "Low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{engagement}</Badge>;
    }
  };

  return (
    <div className="min-h-screen p-6 overflow-hidden text-gray-900" style={{ background: 'transparent' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-purple-400/20 rounded-full blur-3xl animate-moveFromLeft"></div>
        <div className="absolute right-0 w-80 h-80 bg-gradient-to-br from-green-400/20 via-teal-500/20 to-blue-400/20 rounded-full blur-3xl animate-moveFromRight"></div>
        <div className="absolute right-[50%] w-72 h-72 bg-gradient-to-br from-pink-400/20 via-red-500/20 to-orange-400/20 rounded-full blur-3xl animate-moveFromCenter"></div>
      </div>
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-800">Contacts</h2>
            <p className="text-sm text-gray-600">Manage your contact database and segments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-800">Add New Contact</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">Add a new contact to your database</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      placeholder="Enter full name"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      placeholder="Enter email address"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-gray-700">Company</Label>
                    <Input
                      id="company"
                      value={newContact.company}
                      onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                      placeholder="Enter company name"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tags" className="text-gray-700">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={newContact.tags}
                      onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                      placeholder="VIP, Tech, Enterprise"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddContactOpen(false)} className="hover:bg-gray-100">
                      Cancel
                    </Button>
                    <Button onClick={handleAddContact} className="bg-black text-white hover:bg-gray-800">
                      Add Contact
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Contact Lists */}
        <div className="grid gap-4 md:grid-cols-5">
          {contactLists.map((list) => (
            <Card
              key={list.id}
              className={`cursor-pointer transition-sanimsitions ${
                selectedList === list.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedList(list.id)}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{list.count.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">{list.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Search and Filters */}
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search contacts by name, email, or company..."
                  value={searchTerm}
                  onChange={( e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40 border-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* Bulk Actions */}
        {selectedContacts.length > 0 && (
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {selectedContacts.length} contact{selectedContacts.length !== 1 ? "s" : ""} selected
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Add Tags")} className="hover:bg-gray-100">
                    <Tag className="w-4 h-4 mr-2" />
                    Add Tags
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Send Email")} className="hover:bg-gray-100">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("Export")} className="hover:bg-gray-100">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Delete")}
                    className="text-red-600 hover:text-red-700 hover:bg-gray-100"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Contacts Table */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Contact List</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Showing {filteredContacts.length} of {mockContacts.length} contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onCheckedChange={() => handleSelectContact(contact.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {contact.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-gray-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getEngagementBadge(contact.engagement)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(contact.lastActivity).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuLabel className="text-gray-800">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              <span className="text-gray-800">Edit Contact</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              <span className="text-gray-800">Send Email</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Tag className="w-4 h-4 mr-2" />
                              <span className="text-gray-800">Manage Tags</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span className="text-red-600">Delete Contact</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
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