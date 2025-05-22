"use client";

import { AuthForm } from "@/components/sections/authForm";

import FooterImage from "../../../public/footer-img.png";
import LogoForm from "../../../public/logo-form-login.png";
import Logo from "../../../public/logo-login.png";

const Signup = () => {
  const handleSubmit = (values: {
    username: string;
    email?: string;
    senha: string;
  }) => {
    console.log("Signup submitted:", values);
    // Lógica de cadastro
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
