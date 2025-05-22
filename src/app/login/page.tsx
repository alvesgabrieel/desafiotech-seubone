"use client";

import { AuthForm } from "@/components/sections/authForm";

import FooterImage from "../../../public/footer-img.png";
import LogoForm from "../../../public/logo-form-login.png";
import Logo from "../../../public/logo-login.png";

const Login = () => {
  const handleSubmit = (values: { username: string; senha: string }) => {
    console.log("Login submitted:", values);
    // Lógica de login
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
