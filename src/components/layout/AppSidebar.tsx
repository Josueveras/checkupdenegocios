
import { useState } from "react";
import { BarChart, FileText, Calendar, Settings, Edit, File, Target } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const menuItems = [{
  title: "Dashboard",
  url: "/dashboard",
  icon: BarChart
}, {
  title: "Novo Diagnóstico",
  url: "/novo-diagnostico",
  icon: FileText
}, {
  title: "Diagnósticos",
  url: "/diagnosticos",
  icon: File
}, {
  title: "Acompanhamento",
  url: "/acompanhamento",
  icon: Calendar
}, {
  title: "Propostas",
  url: "/propostas",
  icon: FileText
}, {
  title: "Planos",
  url: "/planos",
  icon: Target
}, {
  title: "Perguntas",
  url: "/perguntas",
  icon: Edit
}, {
  title: "Métricas",
  url: "/metricas",
  icon: BarChart
}, {
  title: "Configurações",
  url: "/configuracoes",
  icon: Settings
},import { LayoutDashboard } from "lucide-react";
{
  title: "Conta",
  url: "/conta",
  icon: Settings
}];

export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({
    isActive
  }: {
    isActive: boolean;
  }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"}`;
  return <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-sidebar-border bg-sidebar transition-all duration-300`}>
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <BarChart className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && <div>
              <h2 className="font-semibold text-sidebar-foreground">CheckUp</h2>
              <p className="text-xs text-sidebar-foreground/70">de Negócios</p>
            </div>}
        </div>
      </div>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 mb-2">
            {!collapsed && "Menu Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls} title={collapsed ? item.title : undefined}>
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="p-4 border-t border-sidebar-border">
        <SidebarTrigger className="w-full text-sidebar-accent-foreground bg-accent-foreground text-slate-400" />
      </div>
    </Sidebar>;
}
