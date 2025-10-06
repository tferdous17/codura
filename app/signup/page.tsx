import { Code } from "lucide-react"

import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  return (
    <div className="caffeine-theme bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Code className="size-4" />
          </div>
          Codura
        </a>

        {/* Sign Up Form */}
        <SignUpForm />
      </div>
    </div>
  )
}