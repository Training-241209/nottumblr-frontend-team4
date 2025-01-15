import { ModeToggle } from "@/components/ui/mode-toggle"
import { RegisterForm } from "@/components/auth/components/register-form.tsx"
import Logo from "@/components/sidebars/logo"

export default function RegisterPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 dark:bg-black">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start dark:text-neutral-100 z-10">
          <ModeToggle />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center relative -top-20">
          <div>
            <Logo size="h-36 w-auto" />
          </div>
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/lbj.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
