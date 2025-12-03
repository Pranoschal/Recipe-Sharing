import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Clock, ChefHat, Users, Sparkles } from "lucide-react"

interface Recipe {
  id: string
  title: string
  description: string
  prep_time: number
  cook_time: number
  servings: number
  difficulty: string
  cuisine: string
  image_url: string
  is_ai_generated: boolean
  profiles: {
    username: string
    avatar_url: string
  }
}

export default async function HomePage() {
  const supabase = await createClient()

  const { data: recipes } = await supabase
    .from("recipes")
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })
    .limit(6)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">Share Your Culinary Creations</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto text-pretty">
            Discover, create, and share amazing recipes with our community of food lovers. Powered by AI to help you
            cook better.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {user ? (
              <Button asChild size="lg" variant="secondary">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <ChefHat className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Recipes</h3>
              <p className="text-muted-foreground">Upload and share your favorite recipes with the community</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Sparkles className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">Generate new recipe ideas with our intelligent AI assistant</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">Connect with food lovers and discover amazing dishes</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Recipes */}
      {recipes && recipes.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Recipes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe: Recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gradient-to-br from-orange-200 to-amber-200">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url || "/placeholder.svg"}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ChefHat className="h-16 w-16 text-orange-400" />
                    </div>
                  )}
                  {recipe.is_ai_generated && (
                    <Badge className="absolute top-2 right-2 bg-purple-600">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.prep_time + recipe.cook_time}m
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
