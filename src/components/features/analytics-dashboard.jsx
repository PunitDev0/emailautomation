"use client";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BarChart3, TrendingUp, Users, Mail, Eye, MousePointerClickIcon as Click, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const metrics = [
  {
    title: "Total Opens",
    value: "12,543",
    change: "+12.5%",
    trend: "up",
    icon: Eye,
  },
  {
    title: "Click Rate",
    value: "3.2%",
    change: "+0.8%",
    trend: "up",
    icon: Click,
  },
  {
    title: "Subscribers",
    value: "8,921",
    change: "+5.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Deliverability",
    value: "98.7%",
    change: "-0.3%",
    trend: "down",
    icon: Mail,
  },
]

const campaignData = [
  {
    name: "Welcome Series",
    sent: 1250,
    opened: 892,
    clicked: 156,
    openRate: "71.4%",
    clickRate: "12.5%",
    status: "active",
  },
  {
    name: "Product Launch",
    sent: 3200,
    opened: 1984,
    clicked: 287,
    openRate: "62.0%",
    clickRate: "9.0%",
    status: "completed",
  },
  {
    name: "Newsletter #42",
    sent: 2100,
    opened: 1344,
    clicked: 201,
    openRate: "64.0%",
    clickRate: "9.6%",
    status: "active",
  },
]

export default function AnalyticsDashboard({
  isOpen,
  onClose
}) {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
            {/* Header */}
            <div
              className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
                  <p className="text-gray-600">Track your email performance</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ×
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-auto">
              <Tabs defaultValue="overview" className="h-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="audience">Audience</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric, index) => (
                      <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                                <div className="flex items-center mt-1">
                                  <TrendingUp
                                    className={`w-4 h-4 mr-1 ${
                                      metric.trend === "up"
                                        ? "text-green-500"
                                        : metric.trend === "down"
                                          ? "text-red-500 rotate-180"
                                          : "text-gray-400"
                                    }`} />
                                  <span
                                    className={`text-sm font-medium ${
                                      metric.trend === "up"
                                        ? "text-green-600"
                                        : metric.trend === "down"
                                          ? "text-red-600"
                                          : "text-gray-600"
                                    }`}>
                                    {metric.change}
                                  </span>
                                </div>
                              </div>
                              <div className="p-3 bg-gray-100 rounded-full">
                                <metric.icon className="w-6 h-6 text-gray-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Charts Placeholder */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Open Rate Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Chart visualization would appear here</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Click-through Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Chart visualization would appear here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="campaigns" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Recent Campaigns</h3>
                    <Button size="sm">Create Campaign</Button>
                  </div>

                  <div className="space-y-4">
                    {campaignData.map((campaign, index) => (
                      <motion.div
                        key={campaign.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h4 className="font-semibold text-gray-800">{campaign.name}</h4>
                                  <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                                    {campaign.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-600">Sent</p>
                                    <p className="font-medium">{campaign.sent.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Opened</p>
                                    <p className="font-medium">{campaign.opened.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Clicked</p>
                                    <p className="font-medium">{campaign.clicked.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Open Rate</p>
                                    <p className="font-medium text-green-600">{campaign.openRate}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Click Rate</p>
                                    <p className="font-medium text-blue-600">{campaign.clickRate}</p>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="audience">
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Audience Analytics</h3>
                    <p className="text-gray-600">Detailed audience insights and segmentation data</p>
                  </div>
                </TabsContent>

                <TabsContent value="performance">
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Performance Metrics</h3>
                    <p className="text-gray-600">Advanced performance analytics and benchmarking</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
