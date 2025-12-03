"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/image-upload"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Plus, X } from "lucide-react"

interface RecipeFormProps {
  userId: string
  initialData?: {
    id: string
    title: string
    description: string
    ingredients: string[]
    instructions: string[]
    prep_time: number
    cook_time: number
    servings: number
    difficulty: string
    cuisine: string
    image_url: string
  }
}

export function RecipeForm({ userId, initialData }: RecipeFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [""])
  const [instructions, setInstructions] = useState<string[]>(initialData?.instructions || [""])
  const [prepTime, setPrepTime] = useState(initialData?.prep_time || 0)
  const [cookTime, setCookTime] = useState(initialData?.cook_time || 0)
  const [servings, setServings] = useState(initialData?.servings || 1)
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "easy")
  const [cuisine, setCuisine] = useState(initialData?.cuisine || "")
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const addIngredient = () => setIngredients([...ingredients, ""])
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index))
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const addInstruction = () => setInstructions([...instructions, ""])
  const removeInstruction = (index: number) => setInstructions(instructions.filter((_, i) => i !== index))
  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions]
    newInstructions[index] = value
    setInstructions(newInstructions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const supabase = createClient()

    try {
      const filteredIngredients = ingredients.filter((i) => i.trim())
      const filteredInstructions = instructions.filter((i) => i.trim())

      if (filteredIngredients.length === 0 || filteredInstructions.length === 0) {
        throw new Error("Please add at least one ingredient and instruction")
      }

      const recipeData = {
        user_id: userId,
        title,
        description,
        ingredients: filteredIngredients,
        instructions: filteredInstructions,
        prep_time: prepTime,
        cook_time: cookTime,
        servings,
        difficulty,
        cuisine,
        image_url: imageUrl || null,
        is_ai_generated: false,
      }

      if (initialData?.id) {
        const { error } = await supabase.from("recipes").update(recipeData).eq("id", initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("recipes").insert(recipeData)

        if (error) throw error
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Recipe" : "New Recipe"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Recipe Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Creamy Pasta Carbonara"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your recipe..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>
          </div>

          {/* Recipe Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prepTime">Prep Time (minutes) *</Label>
              <Input
                id="prepTime"
                type="number"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cookTime">Cook Time (minutes) *</Label>
              <Input
                id="cookTime"
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="servings">Servings *</Label>
              <Input
                id="servings"
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number.parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g., Italian, Mexican, Chinese"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <Label>Ingredients *</Label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder="e.g., 2 cups flour"
                  />
                  {ingredients.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeIngredient(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label>Instructions *</Label>
            <div className="space-y-2">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-orange-100 rounded text-sm font-semibold text-orange-600">
                    {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder="Describe this step..."
                    rows={2}
                  />
                  {instructions.length > 1 && (
                    <Button type="button" variant="outline" size="icon" onClick={() => removeInstruction(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
              <Plus className="h-4 w-4 mr-2" />
              Add Step
            </Button>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : initialData ? "Update Recipe" : "Create Recipe"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
