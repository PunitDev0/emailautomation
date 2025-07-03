"use client";
import { useState } from "react"
import { Mail, Users, TrendingUp, Send, Eye, MousePointer, ArrowUp, ArrowDown, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const emailPerformanceData = [
  { month: "Jan", sent: 1200, opened: 840, clicked: 168 },
  { month: "Feb", sent: 1500, opened: 1050, clicked: 210 },
  { month: "Mar", sent: 1800, opened: 1260, clicked: 252 },
  { month: "Apr", sent: 2100, opened: 1470, clicked: 294 },
  { month: "May", sent: 2400, opened: 1680, clicked: 336 },
  { month: "Jun", sent: 2800, opened: 1960, clicked: 392 },
]

const campaignTypeData = [
  { name: "Newsletter", value: 45, color: "#8884d8" },
  { name: "Promotional", value: 30, color: "#82ca9d" },
  { name: "Welcome", value: 15, color: "#ffc658" },
  { name: "Follow-up", value: 10, color: "#ff7c7c" },
]

const recentCampaigns = [
  { name: "Summer Sale Newsletter", sent: 2400, openRate: 78, status: "Completed", date: "2 hours ago" },
  { name: "Product Update", sent: 1200, openRate: 65, status: "Completed", date: "1 day ago" },
  { name: "Welcome Series #3", sent: 800, openRate: 82, status: "Completed", date: "2 days ago" },
  { name: "Customer Survey", sent: 1500, openRate: 45, status: "Completed", date: "3 days ago" },
]

export function DashboardOverview({
  userRole
}) {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your email campaigns.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("7d")}
            className={timeRange === "7d" ? "bg-blue-50" : ""}>
            7 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("30d")}
            className={timeRange === "30d" ? "bg-blue-50" : ""}>
            30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimeRange("90d")}
            className={timeRange === "90d" ? "bg-blue-50" : ""}>
            90 Days
          </Button>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,847</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.2%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2.1%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.7%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-500">-0.8%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,247</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+156</span>
              <span className="ml-1">new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Email Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Email Performance Trends</CardTitle>
            <CardDescription>Track your email metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emailPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sent" stroke="#8884d8" name="Sent" />
                <Line type="monotone" dataKey="opened" stroke="#82ca9d" name="Opened" />
                <Line type="monotone" dataKey="clicked" stroke="#ffc658" name="Clicked" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign Types */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Distribution</CardTitle>
            <CardDescription>Breakdown of your campaign types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {campaignTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest email campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.sent.toLocaleString()} recipients • {campaign.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{campaign.openRate}%</p>
                      <p className="text-xs text-muted-foreground">Open Rate</p>
                    </div>
                    <Badge variant="secondary">{campaign.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Send className="w-4 h-4 mr-2" />
              Create New Campaign
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Design Template
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Import Contacts
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            {userRole === "admin" && (
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                System Health
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Goals</CardTitle>
          <CardDescription>Track your progress towards monthly targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Emails Sent</span>
                <span>12,847 / 15,000</span>
              </div>
              <Progress value={85.6} className="h-2" />
              <p className="text-xs text-muted-foreground">85.6% of monthly goal</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>New Subscribers</span>
                <span>156 / 200</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">78% of monthly goal</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Campaign ROI</span>
                <span>$12,400 / $10,000</span>
              </div>
              <Progress value={124} className="h-2" />
              <p className="text-xs text-muted-foreground">124% of monthly goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
