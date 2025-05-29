
import { useState } from "react";
import { 
  BarChart, 
  FileText, 
  Calendar, 
  Settings,
  Edit,
  File,
  TrendingUp,
  Package,
  Palette,
  Plug,
  User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart },
  { title: "Novo Diagnóstico", url: "/novo-diagnostico", icon: FileText },
  { title: "Diagnósticos", url: "/diagnosticos", icon: File },
  { title: "Acompanhamento", url: "/acompanhamento", icon: Calendar },
  { title: "Propostas", url: "/propostas", icon: FileText },
  { title: "Meus Planos", url: "/meus-planos", icon: Package },
  { title: "Editor de Perguntas", url: "/editor-perguntas", icon: Edit },
  { title: "Métricas", url: "/metricas", icon: TrendingUp },
  { title: "Personalização", url: "/personalizacao", icon: Palette },
  { title: "Integrações", url: "/integracoes", icon: Plug },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
  { title: "Conta", url: "/conta", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-gray-200 bg-white transition-all duration-300`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0F3244] rounded-lg flex items-center justify-center">
            <BarChart className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-[#0F3244]">CheckUp</h2>
              <p className="text-xs text-gray-600">de Negócios</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 mb-2">
            {!collapsed && "Menu Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-[#0F3244] text-white font-medium" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-gray-200">
        <SidebarTrigger className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" />
      </div>
    </Sidebar>
  );
}
