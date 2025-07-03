"use client";
import { Calendar, Mail, TrendingUp, AlertCircle, Eye, Download, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const mockCampaigns = [
  {
    id: 1,
    name: "Welcome Blast",
    dateSent: "2025-06-20",
    sent: 45,
    failed: 5,
    status: "Completed",
    openRate: "68%",
    clickRate: "12%",
    template: "Welcome Template",
    contactList: "All Contacts",
  },
  {
    id: 2,
    name: "Product Update",
    dateSent: "2025-06-25",
    sent: 30,
    failed: 0,
    status: "Completed",
    openRate: "72%",
    clickRate: "18%",
    template: "Product Launch Template",
    contactList: "Tech Companies",
  },
  {
    id: 3,
    name: "Newsletter June",
    dateSent: "2025-06-28",
    sent: 120,
    failed: 3,
    status: "Completed",
    openRate: "65%",
    clickRate: "8%",
    template: "Newsletter Template",
    contactList: "All Contacts",
  },
  {
    id: 4,
    name: "Summer Sale",
    dateSent: "2025-06-30",
    sent: 89,
    failed: 1,
    status: "Completed",
    openRate: "78%",
    clickRate: "25%",
    template: "Product Launch Template",
    contactList: "VIP Customers",
  },
  {
    id: 5,
    name: "Onboarding Series #1",
    dateSent: "2025-07-01",
    sent: 23,
    failed: 0,
    status: "Scheduled",
    openRate: "-",
    clickRate: "-",
    template: "Welcome Template",
    contactList: "Recent Signups",
  },
]

export function EmailHistoryPage({
  userRole
}) {
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    if (statusFilter === "all") return true
    return campaign.status.toLowerCase() === statusFilter;
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">Completed
                      </Badge>
        );
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "Scheduled":
        return <Badge variant="secondary">Scheduled</Badge>;
      case "Sending":
        return <Badge variant="outline">Sending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  const totalSent = mockCampaigns.reduce((sum, campaign) => sum + campaign.sent, 0)
  const totalFailed = mockCampaigns.reduce((sum, campaign) => sum + campaign.failed, 0)
  const completedCampaigns = mockCampaigns.filter((c) => c.status === "Completed")
  const avgOpenRate = Math.round(
    completedCampaigns.reduce((sum, campaign) => sum + Number.parseInt(campaign.openRate), 0) /
      completedCampaigns.length
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email History</h2>
          <p className="text-muted-foreground">View your past email campaigns and their performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sending">Sending</SelectItem>
            </SelectContent>
          </Select>
          {userRole === "admin" && (
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">All time campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Emails</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFailed}</div>
            <p className="text-xs text-muted-foreground">Delivery failures</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate}%</div>
            <p className="text-xs text-muted-foreground">Across completed campaigns</p>
          </CardContent>
        </Card>
      </div>
      {/* Campaign History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign History</CardTitle>
          <CardDescription>
            Detailed view of all your email campaigns ({filteredCampaigns.length} campaigns)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Contact List</TableHead>
                  <TableHead>Date Sent</TableHead>
                  <TableHead className="text-center">Sent</TableHead>
                  <TableHead className="text-center">Failed</TableHead>
                  <TableHead className="text-center">Open Rate</TableHead>
                  <TableHead className="text-center">Click Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{campaign.template}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{campaign.contactList}</TableCell>
                    <TableCell>{new Date(campaign.dateSent).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">{campaign.sent}</TableCell>
                    <TableCell className="text-center">{campaign.failed}</TableCell>
                    <TableCell className="text-center">{campaign.openRate}</TableCell>
                    <TableCell className="text-center">{campaign.clickRate}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredCampaigns.length === 0 && (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
              <p className="text-muted-foreground">No campaigns match the selected filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
