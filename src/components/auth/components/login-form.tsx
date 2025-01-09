import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginSchema, LoginSchema } from "../schemas/login-schema";
import { useLogin } from "../hooks/use-login";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: LoginSchema) {
    login(values);
  }
  
  return (
    <form className={cn("flex flex-col gap-6" , className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold dark:text-neutral-100">Login to your account</h1>
        <p className="text-balance text-sm text-neutral-500 dark:text-neutral-400">
          Enter your username below to login to your account
        </p>
      </div>
      <div className="grid gap-6 dark:text-neutral-100">
        <div className="grid gap-2">
          <Label htmlFor="email">Username</Label>
            <Input
            id="username"
            type="text"
            placeholder="LebronJames001"
            {...form.register("username")} 
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center ">
            <Label htmlFor="password">Password</Label>
          </div>
            <Input
            id="password"
            type="password"
            {...form.register("password")}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Login
        </Button>
      </div>
      <div className="text-center text-sm dark:text-neutral-100">
        Don&apos;t have an account?      {""}
        <a href="/auth/register" className="underline underline-offset-4">
          Register
        </a>
      </div>
    </form>
  )
}
