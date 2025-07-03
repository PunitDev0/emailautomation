"use client";
import { useState } from "react"
import { TrendingUp, TrendingDown, Mail, Eye, MousePointer, Users, Calendar, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const performanceData = [
  { date: "2025-06-01", sent: 1200, delivered: 1180, opened: 826, clicked: 165, bounced: 20, unsubscribed: 5 },
  { date: "2025-06-02", sent: 1500, delivered: 1485, opened: 1040, clicked: 208, bounced: 15, unsubscribed: 3 },
  { date: "2025-06-03", sent: 1800, delivered: 1770, opened: 1239, clicked: 248, bounced: 30, unsubscribed: 8 },
  { date: "2025-06-04", sent: 2100, delivered: 2070, opened: 1449, clicked: 290, bounced: 30, unsubscribed: 6 },
  { date: "2025-06-05", sent: 2400, delivered: 2364, opened: 1655, clicked: 331, bounced: 36, unsubscribed: 12 },
  { date: "2025-06-06", sent: 2800, delivered: 2744, opened: 1921, clicked: 384, bounced: 56, unsubscribed: 15 },
  { date: "2025-06-07", sent: 3200, delivered: 3136, opened: 2195, clicked: 439, bounced: 64, unsubscribed: 18 },
]

const campaignPerformance = [
  { name: "Welcome Series", sent: 2400, opened: 1920, clicked: 384, openRate: 80, clickRate: 16 },
  { name: "Newsletter", sent: 1800, opened: 1260, clicked: 189, openRate: 70, clickRate: 10.5 },
  { name: "Product Launch", sent: 1200, opened: 936, clicked: 187, openRate: 78, clickRate: 15.6 },
  { name: "Re-engagement", sent: 800, opened: 360, clicked: 36, openRate: 45, clickRate: 4.5 },
  { name: "Birthday Campaign", sent: 600, opened: 510, clicked: 153, openRate: 85, clickRate: 25.5 },
]

const deviceData = [
  { name: "Desktop", value: 45, color: "#8884d8" },
  { name: "Mobile", value: 40, color: "#82ca9d" },
  { name: "Tablet", value: 15, color: "#ffc658" },
]

const locationData = [
  { country: "United States", opens: 1250, clicks: 187 },
  { country: "United Kingdom", opens: 890, clicks: 134 },
  { country: "Canada", opens: 650, clicks: 98 },
  { country: "Australia", opens: 420, clicks: 63 },
  { country: "Germany", opens: 380, clicks: 57 },
]

export function AnalyticsPage({
  userRole
}) {
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("opens")

  const totalSent = performanceData.reduce((sum, day) => sum + day.sent, 0)
  const totalOpened = performanceData.reduce((sum, day) => sum + day.opened, 0)
  const totalClicked = performanceData.reduce((sum, day) => sum + day.clicked, 0)
  const totalBounced = performanceData.reduce((sum, day) => sum + day.bounced, 0)

  const openRate = ((totalOpened / totalSent) * 100).toFixed(1)
  const clickRate = ((totalClicked / totalSent) * 100).toFixed(1)
  const bounceRate = ((totalBounced / totalSent) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Detailed insights into your email campaign performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+23.5%</span>
              <span className="ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2.1%</span>
              <span className="ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clickRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-500">-0.8%</span>
              <span className="ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bounceRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">-0.3%</span>
              <span className="ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Performance Over Time */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Performance Over Time</CardTitle>
              <CardDescription>Track your email metrics across the selected time period</CardDescription>
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opens">Opens</SelectItem>
                <SelectItem value="clicks">Clicks</SelectItem>
                <SelectItem value="sent">Emails Sent</SelectItem>
                <SelectItem value="bounced">Bounces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Compare performance across different campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="openRate" fill="#8884d8" name="Open Rate %" />
                <Bar dataKey="clickRate" fill="#82ca9d" name="Click Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>How your audience reads emails by device</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      {/* Geographic Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Performance</CardTitle>
          <CardDescription>Email engagement by country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationData.map((location, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{location.country}</h4>
                  <p className="text-sm text-muted-foreground">
                    {location.opens.toLocaleString()} opens • {location.clicks.toLocaleString()} clicks
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{((location.clicks / location.opens) * 100).toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">CTR</p>
                  </div>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>Comprehensive breakdown of email performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Delivery Metrics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Delivered</span>
                  <span>{(totalSent - totalBounced).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bounced</span>
                  <span>{totalBounced.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Rate</span>
                  <span>{(((totalSent - totalBounced) / totalSent) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Engagement Metrics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Unique Opens</span>
                  <span>{totalOpened.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unique Clicks</span>
                  <span>{totalClicked.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Click-to-Open Rate</span>
                  <span>{((totalClicked / totalOpened) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">List Health</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Unsubscribes</span>
                  <span>47</span>
                </div>
                <div className="flex justify-between">
                  <span>Spam Complaints</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between">
                  <span>List Growth Rate</span>
                  <span>+2.3%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
