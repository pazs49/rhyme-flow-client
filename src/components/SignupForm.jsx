import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { signup } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(2).max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const SignupForm = ({ setIsLoginForm }) => {
  const mutation = useMutation({
    mutationFn: () => signup(form.getValues()),
    onMutate: () => {},
    onSuccess: () => {
      toast.success("Signup successful! Please login.");
      setIsLoginForm(true);
      // console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      form.reset();
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values) => {
    if (values.password !== values.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    mutation.mutate();
    // console.log("Submitted values:", values);
  };

  return (
    <Card className="w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg">
      <CardTitle className="text-center text-2xl font-bold mb-4">Register</CardTitle>
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className={"w-full"}
                    placeholder="user@email.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} className="w-full" />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="-mt-2 w-full sm:w-auto" variant="primary" type="submit">
            Submit
          </Button>
        </form>
        <a
          className="underline text-green-600 hover:text-green-700"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsLoginForm(true);
          }}
        >
          Signin
        </a>
      </FormProvider>
    </Card>
  );
};

export default SignupForm;
