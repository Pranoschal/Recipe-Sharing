import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, ChefHat, Clock, Sparkles, Edit } from "lucide-react"
import { DeleteRecipeButton } from "@/components/delete-recipe-button"

interface Recipe {
  id: string
  title: string
  description: string
  prep_time: number
  cook_time: number
  difficulty: string
  image_url: string
  is_ai_generated: boolean
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const handleSignOut = async () => {
    "use server"
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-orange-600">Recipe Share</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
              <span className="text-sm text-muted-foreground min-w-0 break-all max-w-[200px] sm:max-w-none">
                {profile?.username || user.email}
              </span>
              <form action={handleSignOut}>
                <Button variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.username}!</h2>
          <p className="text-muted-foreground">Manage your recipes and create new ones</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button asChild size="lg">
            <Link href="/dashboard/recipes/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Recipe
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/dashboard/generate">
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </Link>
          </Button>
        </div>

        {/* Recipes Grid */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Recipes</h3>
          {!recipes || recipes.length === 0 ? (
            <Card className="p-12 text-center">
              <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">You haven&apos;t created any recipes yet</p>
              <Button asChild>
                <Link href="/dashboard/recipes/new">Create Your First Recipe</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe: Recipe) => (
                <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prep_time + recipe.cook_time}m
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {recipe.difficulty}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Link href={`/dashboard/recipes/${recipe.id}/edit`}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteRecipeButton recipeId={recipe.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
