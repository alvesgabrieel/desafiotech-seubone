"use client";

import { Loader } from "lucide-react";

import ProtectedRoute from "@/components/protectedRoute";
import { useAuthStore } from "@/store/authStore";

const Dashboard = () => {
  const { user, logout, isLoading } = useAuthStore();

  if (isLoading)
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Loader className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1>Dashboard</h1>
        <p>Bem-vindo, {user?.username}!</p>
        <button
          onClick={logout}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
        >
          Sair
        </button>

        <div className="mt-8 rounded border p-4">
          <h2>Conteúdo Exclusivo</h2>
          <p>Esta área só é visível para usuários autenticados.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
