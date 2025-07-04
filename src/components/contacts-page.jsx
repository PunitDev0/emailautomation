"use client";
import { useState } from "react"
import { Search, Filter, Edit, Trash2, Mail, Download, UserPlus, Tag, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const mockContacts = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@techcorp.com",
    company: "TechCorp",
    status: "Active",
    tags: ["VIP", "Tech"],
    lastActivity: "2025-06-30",
    source: "Website",
    engagement: "High",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@startup.io",
    company: "StartupXYZ",
    status: "Active",
    tags: ["Startup"],
    lastActivity: "2025-06-28",
    source: "Import",
    engagement: "Medium",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@enterprise.com",
    company: "Enterprise Inc",
    status: "Inactive",
    tags: ["Enterprise", "VIP"],
    lastActivity: "2025-06-15",
    source: "Manual",
    engagement: "Low",
  },
  {
    id: "4",
    name: "David Wilson",
    email: "david@cloudbase.com",
    company: "CloudBase",
    status: "Active",
    tags: ["Cloud", "Tech"],
    lastActivity: "2025-06-29",
    source: "API",
    engagement: "High",
  },
  {
    id: "5",
    name: "Emma Brown",
    email: "emma@innovate.com",
    company: "InnovateLab",
    status: "Bounced",
    tags: ["Innovation"],
    lastActivity: "2025-06-20",
    source: "Website",
    engagement: "Medium",
  },
]

const contactLists = [
  { id: "all", name: "All Contacts", count: 3247 },
  { id: "active", name: "Active Subscribers", count: 2891 },
  { id: "vip", name: "VIP Customers", count: 156 },
  { id: "tech", name: "Tech Companies", count: 445 },
  { id: "inactive", name: "Inactive", count: 200 },
]

export function ContactsPage({
  userRole
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedList, setSelectedList] = useState("all")
  const [selectedContacts, setSelectedContacts] = useState([])
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    company: "",
    tags: "",
  })

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesList =
      selectedList === "all" ||
      (selectedList === "active" && contact.status === "Active") ||
      (selectedList === "vip" && contact.tags.includes("VIP")) ||
      (selectedList === "tech" && contact.tags.includes("Tech")) ||
      (selectedList === "inactive" && contact.status === "Inactive")

    return matchesSearch && matchesList
  })

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId])
  }

  const handleSelectAll = () => {
    setSelectedContacts(
      selectedContacts.length === filteredContacts.length ? [] : filteredContacts.map((c) => c.id)
    )
  }

  const handleAddContact = () => {
    // Mock add contact
    toast({
      title: "Contact added",
      description: `${newContact.name} has been added to your contacts.`,
    })
    setNewContact({ name: "", email: "", company: "", tags: "" })
    setIsAddContactOpen(false)
  }

  const handleBulkAction = (action) => {
    toast({
      title: `Bulk action: ${action}`,
      description: `Applied ${action} to ${selectedContacts.length} contacts.`,
    })
    setSelectedContacts([])
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">Active
                      </Badge>
        );
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "Bounced":
        return <Badge variant="destructive">Bounced</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  const getEngagementBadge = (engagement) => {
    switch (engagement) {
      case "High":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">High
                      </Badge>
        );
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "Low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{engagement}</Badge>;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contacts</h2>
          <p className="text-muted-foreground">Manage your contact database and segments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogDescription>Add a new contact to your database</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="Enter email address" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newContact.company}
                    onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                    placeholder="Enter company name" />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newContact.tags}
                    onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                    placeholder="VIP, Tech, Enterprise" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddContactOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddContact}>Add Contact</Button>
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
            className={`cursor-pointer transition-colors ${
              selectedList === list.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
            }`}
            onClick={() => setSelectedList(list.id)}>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{list.count.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{list.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contacts by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedContacts.length} contact{selectedContacts.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Add Tags")}>
                  <Tag className="w-4 h-4 mr-2" />
                  Add Tags
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Send Email")}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("Export")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Delete")}
                  className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contact List</CardTitle>
          <CardDescription>
            Showing {filteredContacts.length} of {mockContacts.length} contacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                      onCheckedChange={handleSelectAll} />
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
                        onCheckedChange={() => handleSelectContact(contact.id)} />
                    </TableCell>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{getEngagementBadge(contact.engagement)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(contact.lastActivity).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Tag className="w-4 h-4 mr-2" />
                            Manage Tags
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Contact
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
  );
}
