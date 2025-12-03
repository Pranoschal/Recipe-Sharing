"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"

interface GeneratedRecipe {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prep_time: number
  cook_time: number
  servings: number
  difficulty: string
  cuisine: string
}

export function AIRecipeGenerator({ userId }: { userId: string }) {
  const [ingredients, setIngredients] = useState("")
  const [cuisine, setCuisine] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [dietaryRestrictions, setDietaryRestrictions] = useState("")
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedRecipe(null)

    try {
      const response = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          cuisine,
          difficulty,
          dietaryRestrictions,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate recipe")

      const recipe = await response.json()
      setGeneratedRecipe(recipe)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedRecipe) return

    setIsSaving(true)
    setError(null)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("recipes").insert({
        user_id: userId,
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        prep_time: generatedRecipe.prep_time,
        cook_time: generatedRecipe.cook_time,
        servings: generatedRecipe.servings,
        difficulty: generatedRecipe.difficulty,
        cuisine: generatedRecipe.cuisine,
        is_ai_generated: true,
      })

      if (error) throw error

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save recipe")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Recipe Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ingredients">Ingredients (optional)</Label>
            <Textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="e.g., chicken, tomatoes, garlic"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuisine">Cuisine (optional)</Label>
            <Input
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              placeholder="e.g., Italian, Mexican, Thai"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty (optional)</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietary">Dietary Restrictions (optional)</Label>
            <Input
              id="dietary"
              value={dietaryRestrictions}
              onChange={(e) => setDietaryRestrictions(e.target.value)}
              placeholder="e.g., vegetarian, gluten-free, dairy-free"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Recipe...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Recipe
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Recipe Preview */}
      {generatedRecipe && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{generatedRecipe.title}</span>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Recipe"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{generatedRecipe.description}</p>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold">Prep:</span> {generatedRecipe.prep_time} min
              </div>
              <div>
                <span className="font-semibold">Cook:</span> {generatedRecipe.cook_time} min
              </div>
              <div>
                <span className="font-semibold">Servings:</span> {generatedRecipe.servings}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Ingredients</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {generatedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                {generatedRecipe.instructions.map((instruction, index) => (
                  <li key={index} className="pl-2">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
    </div>
  )
}
