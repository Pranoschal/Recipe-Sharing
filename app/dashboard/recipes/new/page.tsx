import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RecipeForm } from "@/components/recipe-form"

export default async function NewRecipePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Create New Recipe</h1>
        <RecipeForm userId={user.id} />
      </div>
    </div>
  )
}
