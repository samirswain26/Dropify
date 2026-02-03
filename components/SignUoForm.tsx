"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Input } from "./ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";

//  Custom Schema
import { signUpSchema } from "@/schemas/signUpSchema";

export default function SignUpForm() {
  const { signUp, isLoaded, setActive } = useSignUp();

  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [authError, setauthError] = useState<string | null>(null);
  const [verificationCode, setverificationCode] = useState("");
  const [verificationError, setverificationError] = useState<string | null>(
    null,
  );
  const [ShowPassword, setShowpassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setisSubmitting(true);
    setauthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error: any) {
      console.error("Signup error : ", error);
      setauthError(
        error.errors?.[0]?.message ||
          "An error occured during the signup process. Please Signup again.",
      );
    } finally {
      setisSubmitting(false);
    }
  };

  const handleVerificationOnSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setisSubmitting(true);
    setauthError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log("Result verification is:", result);

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
        });
        router.push("/dashboard");
      } else {
        console.error("Verification incomplete", result);
        setverificationError("Verification failed");
      }
    } catch (error: any) {
      console.error("Verification incomplete", error);
      setverificationError(
        error.errors?.[0]?.message ||
          "An error occured during the signup process. Please Signup again.",
      );
    } finally {
      setisSubmitting(false);
    }
  };

  if (verifying) {
    return <h2>Entering firld for OTP.</h2>;
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

        <form onSubmit={() => {}}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                id="email"
                type="email"
                placeholder="Enter your email."
                {...register("email")}
              />
            </Field>

            {/* Pasword */}
            <Field>
              <FieldLabel htmlFor="password" className="relative">
                Pasword
              </FieldLabel>
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
            </Field>

            {/* Confirm Password */}
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Pasword
              </FieldLabel>
              <Input
                id="confirm-pasword"
                type="password"
                placeholder="Re-Enter your pasword."
              />
            </Field>
            <Field orientation="horizontal" className="flex justify-center items-center space-x-15" >
              <Button type="reset" variant="outline">
                Reset
              </Button>
              <Button type="submit">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>{/* <p>------</p> */}</CardFooter>
    </Card>
  );
}
