"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Copy,
  Trash2,
  Send,
  Pause,
  Play,
  MoreHorizontal,
  Download,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const campaigns = [
  {
    id: 1,
    name: "Welcome Series",
    subject: "Welcome to our platform!",
    audience: "All Subscribers",
    audienceCount: 1250,
    status: "Sent",
    sentDate: "2024-01-15",
    openRate: "24.5%",
    clickRate: "3.2%",
    revenue: "$2,450",
  },
  {
    id: 2,
    name: "Product Launch",
    subject: "Introducing our new feature",
    audience: "VIP Segment",
    audienceCount: 890,
    status: "Scheduled",
    sentDate: "2024-01-20",
    openRate: "-",
    clickRate: "-",
    revenue: "-",
  },
  {
    id: 3,
    name: "Newsletter #12",
    subject: "Weekly updates and insights",
    audience: "Newsletter Subscribers",
    audienceCount: 756,
    status: "Draft",
    sentDate: "-",
    openRate: "-",
    clickRate: "-",
    revenue: "-",
  },
  {
    id: 4,
    name: "Flash Sale",
    subject: "24-hour flash sale - 50% off!",
    audience: "Active Buyers",
    audienceCount: 432,
    status: "Paused",
    sentDate: "2024-01-12",
    openRate: "31.2%",
    clickRate: "8.7%",
    revenue: "$5,670",
  },
]

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCampaigns, setSelectedCampaigns] = useState([])

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectCampaign = (id) => {
    setSelectedCampaigns((prev) => (prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedCampaigns.length === filteredCampaigns.length) {
      setSelectedCampaigns([])
    } else {
      setSelectedCampaigns(filteredCampaigns.map((c) => c.id))
    }
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Fixed Header */}
      <div className=" border-b-2 border-white/20 bg-black">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Campaigns</h1>
              <p className="text-gray-400 mt-1">Manage and track your email campaigns</p>
            </div>
            <div className="flex gap-3">
              <Button className="bg-black border border-white text-white hover:bg-white hover:text-black">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Link href="/campaigns/create">
                <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-1 gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black border-2 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-black border-2 border-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedCampaigns.length > 0 && (
              <div className="flex items-center gap-3 p-3 border-2 border-white/20 bg-white/5">
                <span className="text-white text-sm">{selectedCampaigns.length} selected</span>
                <Button size="sm" className="bg-black border border-white text-white hover:bg-white hover:text-black">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
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
                  <p className="text-gray-400 text-sm">Total Campaigns</p>
                  <p className="text-2xl font-bold text-white">{campaigns.length}</p>
                </div>
                <Send className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="border-2 border-white/20 bg-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active</p>
                  <p className="text-2xl font-bold text-green-400">
                    {campaigns.filter((c) => c.status === "Sent").length}
                  </p>
                </div>
                <Play className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div className="border-2 border-white/20 bg-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Scheduled</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {campaigns.filter((c) => c.status === "Scheduled").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
            <div className="border-2 border-white/20 bg-black p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Open Rate</p>
                  <p className="text-2xl font-bold text-blue-400">24.5%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </div>

          {/* Campaigns Table */}
          <div className="border-2 border-white/20 bg-black">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCampaigns.length === filteredCampaigns.length}
                      onCheckedChange={handleSelectAll}
                      className="border-white/20"
                    />
                  </TableHead>
                  <TableHead className="text-white font-semibold">Campaign</TableHead>
                  <TableHead className="text-white font-semibold">Subject</TableHead>
                  <TableHead className="text-white font-semibold">Audience</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Sent Date</TableHead>
                  <TableHead className="text-white font-semibold">Open Rate</TableHead>
                  <TableHead className="text-white font-semibold">Click Rate</TableHead>
                  <TableHead className="text-white font-semibold">Revenue</TableHead>
                  <TableHead className="text-white font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="border-white/20 hover:bg-white/5">
                    <TableCell>
                      <Checkbox
                        checked={selectedCampaigns.includes(campaign.id)}
                        onCheckedChange={() => handleSelectCampaign(campaign.id)}
                        className="border-white/20"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{campaign.name}</p>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          {campaign.audienceCount.toLocaleString()} recipients
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-xs truncate">{campaign.subject}</TableCell>
                    <TableCell className="text-gray-300">{campaign.audience}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 text-xs border font-medium ${
                          campaign.status === "Sent"
                            ? "border-green-500 text-green-400 bg-green-500/10"
                            : campaign.status === "Scheduled"
                              ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                              : campaign.status === "Paused"
                                ? "border-orange-500 text-orange-400 bg-orange-500/10"
                                : "border-gray-500 text-gray-400 bg-gray-500/10"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300">{campaign.sentDate}</TableCell>
                    <TableCell className="text-gray-300 font-medium">{campaign.openRate}</TableCell>
                    <TableCell className="text-gray-300 font-medium">{campaign.clickRate}</TableCell>
                    <TableCell className="text-gray-300 font-medium">{campaign.revenue}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-black border-white/20">
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <Send className="h-4 w-4 mr-2" />
                              Send Test
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
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

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12 border-2 border-white/20 bg-black">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No campaigns found matching your criteria.</p>
              <Link href="/campaigns/create">
                <Button className="bg-black border-2 border-white text-white hover:bg-white hover:text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
