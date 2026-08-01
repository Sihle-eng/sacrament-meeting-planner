"use client"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    })
    if (result?.error) setError("Invalid credentials")
    else router.push("/meetings") // redirect to protected area
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
      {error && <p>{error}</p>}
    </form>
  )
}