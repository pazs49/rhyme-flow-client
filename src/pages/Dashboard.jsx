import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import LyricCreate from "@/components/LyricCreate";
import Creations from "@/components/Creations";
import Feed from "@/components/Feed";

import { useState } from "react";

import useCurrentActiveMenu from "@/stores/currentActiveMenu";

export default function Dashboard() {
  const { currentActiveMenu } = useCurrentActiveMenu();

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "350px",
      }}
    >
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1 md:hidden" />
          <h1>{currentActiveMenu}</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {currentActiveMenu === "Create" && <LyricCreate />}
          {currentActiveMenu === "Creations" && <Creations />}
          {currentActiveMenu === "Feed" && <Feed />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
