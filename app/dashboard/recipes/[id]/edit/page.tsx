import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { RecipeForm } from "@/components/recipe-form"

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", id).eq("user_id", user.id).single()

  if (!recipe) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Edit Recipe</h1>
        <RecipeForm userId={user.id} initialData={recipe} />
      </div>
    </div>
  )
}
