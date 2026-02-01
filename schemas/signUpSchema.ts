import * as z from "zod"

export const signUpSchema = z.object({
    email: z
        .string()
        .min(3, {message: "Email is required"})
        .email({message: "Please enter a valid email."}),
    password: z
        .string()
        .min(3, {message: "Password is required"})
        .min(6, {message: "Password should be atleast 6 characters."}),
    passwordConfirmation: z
        .string()
        .min(3, {message: "Please confirm your password"})

})

.refine((data) => data.password === data.passwordConfirmation ,{
    message: "Password do not match",
    path: ["passwordConfirmation"] // This path will show the message in that path. Means to show the message of password matching in the ui.
})
