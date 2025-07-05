  "use client";
  import { useState, useEffect } from "react"
  import { ArrowLeft, Mail, Eye, EyeOff } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { toast } from "sonner"
  import { useAuth } from "@/hooks/use-auth"
  import { useRouter, useSearchParams } from "next/navigation"

  export function AuthPage() {
    const [mode, setMode] = useState("login")
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
      const modeParam = searchParams.get("mode")
      if (modeParam === "signup" || modeParam === "login") {
        setMode(modeParam)
      }
    }, [searchParams])

    const handleSubmit = async (e) => {
      e.preventDefault()
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock authentication
      const user = {
        id: "1",
        name: mode === "signup" ? formData.name : "John Doe",
        email: formData.email,
        role: formData.email.includes("admin") ? ("admin") : ("user"),
      }

      setIsLoading(false)
      toast({
        title: mode === "signup" ? "Account created successfully!" : "Welcome back!",
        description: mode === "signup" ? "You can now start using EmailFlow." : "You've been logged in successfully.",
      })

      login(user)
      router.push("/dashboard")
    }

    const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleBack = () => {
      router.push("/")
    }

    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div
                className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">{mode === "signup" ? "Create your account" : "Welcome back"}</CardTitle>
              <CardDescription>
                {mode === "signup" ? "Start your email marketing journey today" : "Sign in to your EmailFlow account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    required />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      required />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? mode === "signup"
                      ? "Creating account..."
                      : "Signing in..."
                    : mode === "signup"
                      ? "Create Account"
                      : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                {mode === "signup" ? (
                  <p>
                    Already have an account?{" "}
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setMode("login")}>
                      Sign in
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{" "}
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setMode("signup")}>
                      Sign up
                    </button>
                  </p>
                )}
              </div>

              {/* Demo credentials */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-blue-800 mb-1">Demo Credentials:</p>
                <p className="text-blue-700">Email: admin@demo.com (Admin role)</p>
                <p className="text-blue-700">Email: user@demo.com (User role)</p>
                <p className="text-blue-700">Password: Any password</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
