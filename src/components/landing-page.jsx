"use client"

import { Mail, Zap, Users, BarChart3, Check, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: Mail,
    title: "Rich Email Builder",
    description: "Create beautiful emails with our drag-and-drop editor and template library.",
  },
  {
    icon: Users,
    title: "Contact Management",
    description: "Upload and manage your contact lists with ease. Support for CSV and Excel files.",
  },
  {
    icon: Zap,
    title: "Automated Campaigns",
    description: "Set up automated email sequences and schedule campaigns for optimal delivery.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Track open rates, click-through rates, and campaign performance in real-time.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    content: "This tool has revolutionized our email marketing. The template builder is incredibly intuitive!",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Small Business Owner",
    company: "Local Cafe",
    content: "Perfect for small businesses. Easy to use and the results speak for themselves.",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "E-commerce Manager",
    company: "Fashion Store",
    content: "The automation features have saved us hours every week. Highly recommended!",
    rating: 5,
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "Perfect for small businesses",
    features: ["Up to 1,000 contacts", "5 email templates", "Basic analytics", "Email support"],
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing businesses",
    features: ["Up to 10,000 contacts", "Unlimited templates", "Advanced analytics", "Priority support", "Automation"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large organizations",
    features: ["Unlimited contacts", "Custom templates", "Advanced reporting", "24/7 support", "API access"],
    popular: false,
  },
]

export function LandingPage() {
  const router = useRouter()

  const handleSignUp = () => {
    router.push("/auth?mode=signup")
  }

  const handleLogin = () => {
    router.push("/auth?mode=login")
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header
        className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">EmailFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleLogin}>
              Login
            </Button>
            <Button onClick={handleSignUp}>Sign Up</Button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section
        className="py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 New: Advanced Email Builder Now Available
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Email Marketing Made{" "}
            <span
              className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, send, and track beautiful email campaigns with our intuitive drag-and-drop builder. No coding
            required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleSignUp} className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleLogin}
              className="text-lg px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial</p>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you create engaging email campaigns that convert.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div
                    className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-xl text-gray-600">Get started in minutes with our simple 3-step process</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Contacts",
                description: "Import your contact list from CSV or Excel files with just a few clicks.",
              },
              {
                step: "2",
                title: "Create Templates",
                description: "Design beautiful emails using our drag-and-drop builder and template library.",
              },
              {
                step: "3",
                title: "Send & Track",
                description: "Send your campaigns and track performance with detailed analytics.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by thousands of businesses</h2>
            <p className="text-xl text-gray-600">See what our customers have to say about EmailFlow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that's right for your business</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-blue-500 shadow-xl" : "border-0 shadow-lg"}`}>
                {plan.popular && (
                  <Badge
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={handleSignUp}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your email marketing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using EmailFlow to grow their audience and increase sales.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleSignUp}
            className="text-lg px-8">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mail className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">EmailFlow</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2025 EmailFlow. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
