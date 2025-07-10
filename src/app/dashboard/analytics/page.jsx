"use client"

import { useState } from "react"
import { Download, Calendar, TrendingUp, TrendingDown, Mail, Users, MousePointer, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const analyticsData = {
  overview: {
    totalSent: 15420,
    openRate: 24.5,
    clickRate: 3.2,
    bounceRate: 2.1,
    unsubscribeRate: 0.8,
  },
  recentCampaigns: [
    {
      id: 1,
      name: "Welcome Series",
      sent: 1250,
      delivered: 1225,
      opened: 306,
      clicked: 45,
      bounced: 25,
      unsubscribed: 8,
      sentDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Product Launch",
      sent: 890,
      delivered: 875,
      opened: 210,
      clicked: 32,
      bounced: 15,
      unsubscribed: 3,
      sentDate: "2024-01-12",
    },
    {
      id: 3,
      name: "Newsletter #12",
      sent: 756,
      delivered: 740,
      opened: 185,
      clicked: 28,
      bounced: 16,
      unsubscribed: 5,
      sentDate: "2024-01-10",
    },
  ],
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const calculateRate = (numerator, denominator) => {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : "0.0"
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40 bg-black border-white/20 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20">
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-black border border-white text-white hover:bg-white hover:text-black">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Custom Date Range */}
        {dateRange === "custom" && (
          <div className="flex gap-4 mb-6 p-4 border border-white/20">
            <div>
              <label className="text-white text-sm">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-black border-white/20 text-white"
              />
            </div>
            <div>
              <label className="text-white text-sm">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-black border-white/20 text-white"
              />
            </div>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center justify-between mb-2">
              <Mail className="h-8 w-8 text-white" />
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.overview.totalSent.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Total Emails Sent</p>
          </div>

          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-white" />
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.overview.openRate}%</p>
            <p className="text-sm text-gray-400">Open Rate</p>
          </div>

          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center justify-between mb-2">
              <MousePointer className="h-8 w-8 text-white" />
              <TrendingDown className="h-4 w-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.overview.clickRate}%</p>
            <p className="text-sm text-gray-400">Click Rate</p>
          </div>

          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingDown className="h-8 w-8 text-white" />
              <TrendingUp className="h-4 w-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.overview.bounceRate}%</p>
            <p className="text-sm text-gray-400">Bounce Rate</p>
          </div>

          <div className="border border-white/20 bg-black p-6">
            <div className="flex items-center justify-between mb-2">
              <UserX className="h-8 w-8 text-white" />
              <TrendingDown className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{analyticsData.overview.unsubscribeRate}%</p>
            <p className="text-sm text-gray-400">Unsubscribe Rate</p>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <div className="border border-white/20 bg-black">
          <div className="p-4 border-b border-white/20">
            <h2 className="text-lg font-semibold text-white">Recent Campaign Performance</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-white/20 hover:bg-white/5">
                <TableHead className="text-white font-semibold">Campaign</TableHead>
                <TableHead className="text-white font-semibold">Sent</TableHead>
                <TableHead className="text-white font-semibold">Delivered</TableHead>
                <TableHead className="text-white font-semibold">Opened</TableHead>
                <TableHead className="text-white font-semibold">Clicked</TableHead>
                <TableHead className="text-white font-semibold">Open Rate</TableHead>
                <TableHead className="text-white font-semibold">Click Rate</TableHead>
                <TableHead className="text-white font-semibold">Bounce Rate</TableHead>
                <TableHead className="text-white font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.recentCampaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-white/20 hover:bg-white/5">
                  <TableCell className="text-white font-medium">{campaign.name}</TableCell>
                  <TableCell className="text-gray-300">{campaign.sent.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{campaign.delivered.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{campaign.opened.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-300">{campaign.clicked.toLocaleString()}</TableCell>
                  <TableCell className="text-green-400">
                    {calculateRate(campaign.opened, campaign.delivered)}%
                  </TableCell>
                  <TableCell className="text-blue-400">
                    {calculateRate(campaign.clicked, campaign.delivered)}%
                  </TableCell>
                  <TableCell className="text-red-400">{calculateRate(campaign.bounced, campaign.sent)}%</TableCell>
                  <TableCell className="text-gray-300">{campaign.sentDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Chart Placeholder */}
        <div className="mt-8 border border-white/20 bg-black p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Performance Trends</h2>
          <div className="h-64 flex items-center justify-center border border-white/20 bg-white/5">
            <p className="text-gray-400">Chart visualization would be rendered here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
