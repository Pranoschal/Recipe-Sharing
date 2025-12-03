import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { ingredients, cuisine, difficulty, dietaryRestrictions } = await req.json()

    const prompt = `Create a detailed recipe with the following requirements:
${ingredients ? `- Using these ingredients: ${ingredients}` : ""}
${cuisine ? `- Cuisine: ${cuisine}` : ""}
${difficulty ? `- Difficulty level: ${difficulty}` : ""}
${dietaryRestrictions ? `- Dietary restrictions: ${dietaryRestrictions}` : ""}

Please provide a JSON response with this exact structure:
{
  "title": "Recipe name",
  "description": "Brief description",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "prep_time": number (in minutes),
  "cook_time": number (in minutes),
  "servings": number,
  "difficulty": "easy" | "medium" | "hard",
  "cuisine": "cuisine type"
}`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse recipe from AI response")
    }

    const recipe = JSON.parse(jsonMatch[0])

    return Response.json(recipe)
  } catch (error) {
    console.error("Error generating recipe:", error)
    return Response.json({ error: "Failed to generate recipe" }, { status: 500 })
  }
}
