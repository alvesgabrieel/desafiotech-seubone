"use client";

import { Eye, Layers, Users } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";

const data = {
  teams: [
    {
      name: "Fanation",
      logo: "/logo.png",
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Peças",
      url: "/dashboard",
      icon: Layers,
      isActive: true,
    },
    {
      title: "Visualização",
      url: "/visualizacao",
      icon: Eye,
    },
    {
      title: "Clientes",
      url: "#",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const sidebarData = {
    ...data,
    user: {
      name: user?.username || "Usuário",
      email: user?.email || "E-mail",
      avatar: "/avatars/shadcn.jpg",
    },
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
