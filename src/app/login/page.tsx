"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/sections/auth-form";
import { useAuthStore } from "@/store/authStore";

import FooterImage from "../../../public/footer-img.png";
import LogoForm from "../../../public/logo-form-login.png";
import Logo from "../../../public/logo-login.png";

const Login = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (values: { username: string; senha: string }) => {
    try {
      const response = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      login(data.token, { username: data.user.name, email: data.user.email });
      router.push("/dashboard");
      toast.success("Login efetuado com sucesso!");
    } catch (err) {
      toast.error("Ocorreu um erro, tente novamente!!");
      console.log(err);
    }
  };

  return (
    <AuthForm
      type="login"
      logoForm={LogoForm}
      footerImage={FooterImage}
      mainLogo={Logo}
      onSubmit={handleSubmit}
    />
  );
};

export default Login;
