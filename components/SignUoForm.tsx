"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

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

  return <h1>Signup page with email and other things in it.</h1>;
}
