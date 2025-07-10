"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Upload,
  Trash2,
  Tag,
  Filter,
  Download,
  UserPlus,
  Users,
  Mail,
  Calendar,
  MoreHorizontal,
  Edit,
  Ban,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const subscribers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    tags: ["VIP", "Newsletter"],
    status: "Active",
    dateAdded: "2024-01-15",
    lastOpened: "2024-01-18",
    totalOpens: 24,
    source: "Website",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    tags: ["Newsletter"],
    status: "Active",
    dateAdded: "2024-01-14",
    lastOpened: "2024-01-17",
    totalOpens: 12,
    source: "Import",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    tags: ["VIP", "Product Updates"],
    status: "Unsubscribed",
    dateAdded: "2024-01-10",
    lastOpened: "2024-01-12",
    totalOpens: 8,
    source: "API",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    tags: ["Newsletter", "Promotions"],
    status: "Active",
    dateAdded: "2024-01-16",
    lastOpened: "2024-01-19",
    totalOpens: 31,
    source: "Website",
  },
]

export default function SubscribersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [selectedSubscribers, setSelectedSubscribers] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [newSubscriber, setNewSubscriber] = useState({
    name: "",
    email: "",
    tags: "",
  })

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || subscriber.status.toLowerCase() === statusFilter
    const matchesTag = tagFilter === "all" || subscriber.tags.some((tag) => tag.toLowerCase() === tagFilter)
    return matchesSearch && matchesStatus && matchesTag
  })

  const handleSelectSubscriber = (id) => {
    setSelectedSubscribers((prev) => (prev.includes(id) ? prev.filter((subId) => subId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers(filteredSubscribers.map((sub) => sub.id))
    }
  }

  const allTags = Array.from(new Set(subscribers.flatMap((s) => s.tags)))

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b-2 border-white/20 bg-black">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Subscribers</h1>
              <p className="text-gray-400 mt-1">Manage your email subscribers and segments</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-black border border-white text-white hover:bg-white hover:text-black">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
                <DialogTrigger asChild>
                  <Button className="bg-black border border-white text-white hover:bg-white hover:text-black">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-2 border-white text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Import Subscribers</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-white/20 p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">Drag and drop your .xlsx file here</p>
                      <p className="text-sm text-gray-400 mb-4">or click to browse</p>
                      <input type="file" accept=".xlsx,.xls" className="hidden" />
                      <Button className="bg-black border border-white text-white hover:bg-white hover:text-black">
                        Choose File
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Import Options</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="skipDuplicates" className="border-white/20" />
                          <Label htmlFor="skipDuplicates" className="text-white">
                            Skip duplicates
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="sendWelcome" className="border-white/20" />
                          <Label htmlFor="sendWelcome" className="text-white">
                            Send welcome email
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-white text-black hover:bg-gray-200">Upload & Import</Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => setShowImportModal(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subscriber
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-black border-2 border-white text-white">
                  <DialogHeader>
                    <DialogTitle>Add New Subscriber</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newSubscriber.name}
                        onChange={(e) => setNewSubscriber((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-black border-2 border-white/20 text-white"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newSubscriber.email}
                        onChange={(e) => setNewSubscriber((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-black border-2 border-white/20 text-white"
                        placeholder="Enter email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags" className="text-white">
                        Tags (comma separated)
                      </Label>
                      <Input
                        id="tags"
                        value={newSubscriber.tags}
                        onChange={(e) => setNewSubscriber((prev) => ({ ...prev, tags: e.target.value }))}
                        className="bg-black border-2 border-white/20 text-white"
                        placeholder="VIP, Newsletter, Promotions"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-white text-black hover:bg-gray-200">Add Subscriber</Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => setShowAddModal(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-1 gap-4 max-w-3xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subscribers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black border-2 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-black border-2 border-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-40 bg-black border-2 border-white/20 text-white">
                  <Tag className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag.toLowerCase()}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedSubscribers.length > 0 && (
              <div className="flex items-center gap-3 p-3 border-2 border-white/20 bg-white/5">
                <span className="text-white text-sm">{selectedSubscribers.length} selected</span>
                <Button size="sm" className="bg-black border border-white text-white hover:bg-white hover:text-black">
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tags
                </Button>
                <Button size="sm" className="bg-black border border-white text-white hover:bg-white hover:text-black">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="border-2 border-white/20 bg-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Subscribers</p>
                  <p className="text-2xl font-bold text-white">{subscribers.length}</p>
                </div>
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="border-2 border-white/20 bg-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active</p>
                  <p className="text-2xl font-bold text-green-400">
                    {subscribers.filter((s) => s.status === "Active").length}
                  </p>
                </div>
                <UserPlus className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="border-2 border-white/20 bg-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Unsubscribed</p>
                  <p className="text-2xl font-bold text-red-400">
                    {subscribers.filter((s) => s.status === "Unsubscribed").length}
                  </p>
                </div>
                <Ban className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <div className="border-2 border-white/20 bg-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">This Week</p>
                  <p className="text-2xl font-bold text-blue-400">+23</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="border-2 border-white/20 bg-black">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedSubscribers.length === filteredSubscribers.length}
                      onCheckedChange={handleSelectAll}
                      className="border-white/20"
                    />
                  </TableHead>
                  <TableHead className="text-white font-semibold">Subscriber</TableHead>
                  <TableHead className="text-white font-semibold">Email</TableHead>
                  <TableHead className="text-white font-semibold">Tags</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Engagement</TableHead>
                  <TableHead className="text-white font-semibold">Source</TableHead>
                  <TableHead className="text-white font-semibold">Date Added</TableHead>
                  <TableHead className="text-white font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="border-white/20 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onCheckedChange={() => handleSelectSubscriber(subscriber.id)}
                        className="border-white/20"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{subscriber.name}</p>
                        <p className="text-gray-400 text-sm">Last opened: {subscriber.lastOpened}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{subscriber.email}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {subscriber.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-white/20 text-gray-300 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 text-xs border font-medium ${
                          subscriber.status === "Active"
                            ? "border-green-500 text-green-400 bg-green-500/10"
                            : "border-red-500 text-red-400 bg-red-500/10"
                        }`}
                      >
                        {subscriber.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{subscriber.totalOpens} opens</p>
                        <p className="text-gray-400 text-sm">High engagement</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{subscriber.source}</TableCell>
                    <TableCell className="text-gray-300">{subscriber.dateAdded}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-black border-white/20">
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <Tag className="h-4 w-4 mr-2" />
                              Manage Tags
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <Ban className="h-4 w-4 mr-2" />
                              Unsubscribe
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSubscribers.length === 0 && (
            <div className="text-center py-12 border-2 border-white/20 bg-black">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No subscribers found matching your criteria.</p>
              <Button
                className="bg-black border-2 border-white text-white hover:bg-white hover:text-black"
                onClick={() => setShowAddModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Subscriber
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
