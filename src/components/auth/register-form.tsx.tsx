import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6" , className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold dark:text-neutral-100">Register your account</h1>
        <p className="text-balance text-sm text-neutral-500 dark:text-neutral-400">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6 dark:text-neutral-100">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label>First Name</Label>
          <Input id="text" placeholder="Lebron" required />
        </div>
        <div className="grid gap-2">
          <Label>Last Name</Label>
          <Input id="text"placeholder="James" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center ">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center ">
            <Label htmlFor="password">Confirm Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>
      <div className="text-center text-sm dark:text-neutral-100">
        Do you have an account?     {""}
        <a href="/auth/login" className="underline underline-offset-4">
          Log In
        </a>
      </div>
    </form>
  )
}
