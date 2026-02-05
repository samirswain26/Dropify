"use client";
import React from "react";
import { signInSchema } from "@/schema/signInSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const SignInForm = () => {
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

export default SignInForm;
