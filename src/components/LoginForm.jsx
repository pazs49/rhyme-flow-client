import { login } from "../api/auth";
import { useMutation } from "@tanstack/react-query";

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
import { useNavigate } from "react-router";

import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address").min(2).max(50),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginForm = ({ setIsLoginForm }) => {
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success("Login successful!");
      // console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refresh_token", data.refresh_token);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = () => {
    mutation.mutate(form.getValues());
  };

  return (
    <Card className="p-6 h-full">
      <CardTitle className="text-center text-2xl font-bold">
        Welcome Back!
      </CardTitle>
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
                    className={"w-md"}
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
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="-mt-2" variant="primary" type="submit">
            Submit
          </Button>
        </form>
      </FormProvider>
      <div className=" -mt-3 italic">
        Don't have an account?{" "}
        <a
          className="underline"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsLoginForm(false);
          }}
        >
          Sign up for RhymeFlow
        </a>
      </div>
    </Card>
  );
};

export default LoginForm;
