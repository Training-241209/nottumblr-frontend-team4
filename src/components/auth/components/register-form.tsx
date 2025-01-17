import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegister } from "../hooks/use-register";
import { registerSchema, RegisterSchema } from "../schemas/register-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";


export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { mutate: register, isPending } = useRegister();
  const router = useRouter();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      firstname: "",
      lastname: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: RegisterSchema) {
    register(values);
  }

  return (
    <form className={cn("flex flex-col gap-6" , className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold dark:text-neutral-100">Register your account</h1>
        <p className="text-balance text-sm text-neutral-500 dark:text-neutral-400">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6 dark:text-neutral-100">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Lebron@james.com"
            {...form.register("email")} 
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Lebron001"
            {...form.register("username")} 
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>First Name</Label>
          <Input
            id="firstname"
            type="text"
            placeholder="Lebron"
            {...form.register("firstname")} 
            required
          />
        </div>
        <div className="grid gap-2">
          <Label>Last Name</Label>
          <Input
            id="lastname"
            type="text"
            placeholder="James"
            {...form.register("lastname")} 
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
            placeholder=""
            {...form.register("password")} 
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center ">
            <Label htmlFor="password">Confirm Password</Label>
          </div>
          <div className="flex items-center ">
          <Input
            id="confirmPassword"
            type="password"
            placeholder=""
            {...form.register("confirmPassword")} 
            required
          />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Register
        </Button>
      </div>
      <div className="text-center text-sm dark:text-neutral-100">
        Do you have an account?     {""}
        <button
          onClick={() => router.navigate({ to: "/auth/login" })}
          className="underline underline-offset-4"
        >
          Log In
        </button>
      </div>
    </form>
  )
}
