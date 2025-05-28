"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import TopBar from "../top-bar";

interface AuthFormValues {
  username: string;
  email?: string;
  senha: string;
}

type AuthFormProps = {
  type: "login" | "signup";
  logoForm: StaticImageData;
  footerImage: StaticImageData;
  mainLogo: StaticImageData;
  onSubmit: (values: AuthFormValues) => void;
};

export const AuthForm = ({ type, footerImage, onSubmit }: AuthFormProps) => {
  const { theme } = useTheme();

  const logoSrc =
    theme === "dark" ? "/logo-form-login-white.png" : "/logo-form-login.png";

  const formSchema = z.object({
    username: z.string().min(1, {
      message: "Digite um nome de usuário",
    }),
    email:
      type === "signup"
        ? z
            .string()
            .email("Digite um email válido")
            .min(1, "O e-mail é obrigatório")
        : z.string().optional(),
    senha: z.string().min(1, {
      message: "Digite uma senha",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      senha: "",
    },
  });

  return (
    <>
      <div>
        <TopBar />
        <div className="flex min-h-screen items-center justify-center">
          <div className="w-full max-w-md rounded-lg p-8">
            <div className="flex items-center justify-center">
              <Image
                src={logoSrc}
                alt="Fanation Logo"
                width={120}
                height={40}
              />
            </div>
            <h2 className="mt-4 mb-2 text-center text-2xl font-light text-[#9A0FF1]">
              {type === "login" ? "Bem-vindo ao Fanation" : "Crie sua conta"}
            </h2>
            <p className="mb-10 text-center">
              {type === "login"
                ? "Acesse sua conta para iniciar"
                : "Preencha os dados para se cadastrar"}
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome de usuário"
                          {...field}
                          className="bg-amber-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {type === "signup" && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite seu email"
                            {...field}
                            type="email"
                            className="bg-amber-50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite sua senha"
                          {...field}
                          type="password"
                          className="bg-amber-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="mt-4 w-full cursor-pointer bg-[#9A0FF1] hover:bg-violet-600"
                >
                  {type === "login" ? "Entrar" : "Cadastrar"}
                </Button>

                <Button className="mt-1 w-full" asChild>
                  <Link href={type === "login" ? "/signup" : "/login"}>
                    {type === "login"
                      ? "Não possui uma conta? Cadastre-se"
                      : "Já possui uma conta? Faça login"}
                  </Link>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <div className="flex justify-center pb-4">
        <span>
          <Image
            src={footerImage}
            alt="Fanation Logo"
            width={252}
            height={40}
            className="ml-8"
          />
        </span>
      </div>
    </>
  );
};
