"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/sections/authForm";
import { useAuthStore } from "@/store/authStore";

import FooterImage from "../../../public/footer-img.png";
import LogoForm from "../../../public/logo-form-login.png";
import Logo from "../../../public/logo-login.png";

const Signup = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Loader className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );

  const handleSubmit = async (values: {
    username: string;
    email?: string;
    senha: string;
  }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erro ao registrar");
      }

      toast.success(data.message);
      router.push("/login");
    } catch (err) {
      toast.error("Ocorreu um erro, tente novamente");
      console.log(err);
    }
  };

  return (
    <AuthForm
      type="signup"
      logoForm={LogoForm}
      footerImage={FooterImage}
      mainLogo={Logo}
      onSubmit={handleSubmit}
    />
  );
};

export default Signup;
