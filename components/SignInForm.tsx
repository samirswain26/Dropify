"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { signInSchema } from "@/schemas/signInSchema";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  AlertCircleIcon,
  CheckCircle,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";
import { Input } from "./ui/input";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function SignInForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [ShowPassword, setShowpassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async(data: z.infer<typeof signInSchema> ) => {
    if(!isLoaded) return null

    setIsSubmitting(true)
    setAuthError(null)

    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password
      })

      if(result.status === "complete"){
        await setActive({session: result.createdSessionId})
        router.push("/dashboard")
      }else{
        console.error("Signin failed", result)
        setAuthError("Signin not completed")
      }
    } catch (error: any) {
      console.error("Signin error :", error)
      setAuthError(
        error.errors?.[0]?.message || "Auth failed in signin."
      )
    }finally{
      setIsSubmitting(false)
    }
  }


  return (
    <Card className="w-full max-w-md bg-secondary border-4 shadow-2xl bg-default-50">
      <CardHeader className="flex flex-col items-center gap-1 pb-2">
        <CardTitle className="text-2xl gap-2">Create Account</CardTitle>
        <CardDescription className=" text-default-500 text-center">
          Signup to start and manage your file service securely.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2 text-primary">
        {authError && (
          <div>
            <Alert variant="destructive" className="max-w-md">
              <AlertCircleIcon />
              <AlertTitle>Authentication failed</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email */}
            <Field>
              <FieldLabel 
              htmlFor="email"
              >Email</FieldLabel>

              <Input
                id="identifier"
                type="email"
                placeholder="Enter your email."
                {...register("identifier")}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.identifier.message}
                </p>
              )}
            </Field>

            {/* Pasword */}
            <Field>
              <FieldLabel htmlFor="password">Pasword</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={ShowPassword ? "text" : "password"}
                  placeholder="Enter your pasword."
                  {...register("password")}
                />
                <button
                  onClick={() => setShowpassword(!ShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  {ShowPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </Field>

            {/* Submit Button */}
            <div className="space-y-40">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 mt-0.5 text-primary" />
                <p className="text-sm">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </div>
            <Field className="flex justify-center items-center space-x-15">
              <Button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      {/* Login */}
      <CardFooter className="flex items-center">
        <p className="text-sm flex items-center justify-center-safe">
          Already have an account?
        </p>
        <Link href={"/login"} className=" text-sm ml-1 hover:text-blue-800">
          Sign Up
        </Link>
      </CardFooter>
    </Card>

  );
}