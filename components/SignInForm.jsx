"use client";
import React from "react";
import { signInSchema } from "@/schema/signInSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {useSignIn} from "@clerk/nextjs"
import {zodResolver} from "@hookform/resolvers"
import { useRouter } from "next/navigation";

export default function SignInForm () {

  const router = useRouter()



  const {
    register,
    handleSubmit,
    formdata: { errors },
  } = useForm <
  z.infer <
  typeof signInSchema >>
    {
      resolver: zodResolver(signInSchema),
      defaultValues:{
        email: "",
        pasword: ""
      }
    };

  return <div>SignInForm</div>;
};

