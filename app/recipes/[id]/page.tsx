import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Users, ChefHat, Sparkles, ArrowLeft } from "lucide-react"

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: recipe } = await supabase
    .from("recipes")
    .select(`
      *,
      profiles (
        username,
        avatar_url,
        full_name
      )
    `)
    .eq("id", id)
    .single()

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card className="overflow-hidden shadow-xl">
          {/* Recipe Image */}
          <div className="relative h-96 bg-gradient-to-br from-orange-200 to-amber-200">
            {recipe.image_url ? (
              <img
                src={recipe.image_url || "/placeholder.svg"}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ChefHat className="h-24 w-24 text-orange-400" />
              </div>
            )}
            {recipe.is_ai_generated && (
              <Badge className="absolute top-4 right-4 bg-purple-600">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>

          <CardContent className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{recipe.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>By {recipe.profiles?.username || "Anonymous"}</span>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="grid sm:grid-cols-4 gap-4 mb-8 p-4 bg-orange-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="h-4 w-4 mr-1 text-orange-600" />
                </div>
                <div className="text-sm font-semibold">{recipe.prep_time + recipe.cook_time} min</div>
                <div className="text-xs text-muted-foreground">Total Time</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="h-4 w-4 mr-1 text-orange-600" />
                </div>
                <div className="text-sm font-semibold">{recipe.servings}</div>
                <div className="text-xs text-muted-foreground">Servings</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold capitalize">{recipe.difficulty}</div>
                <div className="text-xs text-muted-foreground">Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold">{recipe.cuisine}</div>
                <div className="text-xs text-muted-foreground">Cuisine</div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 p-2 rounded hover:bg-orange-50">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-orange-600 flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-600 text-white rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <p className="pt-1 flex-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
