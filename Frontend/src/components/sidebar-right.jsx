import * as React from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function SidebarRight({ ...props }) {
  const { user } = useAuth();

  const avatarSrc = user?.avatar?.startsWith("http")
    ? user.avatar
    : `http://localhost:8081${user?.avatar}`;

  return (
    <Sidebar
      collapsible="none"
      className="sticky hidden lg:flex top-0 h-svh border-l bg-white dark:bg-gray-900"
      {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={{ ...user, avatar: avatarSrc }} />
      </SidebarHeader>
      <SidebarContent className="space-y-4 px-4 py-3">
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars
          calendars={[
            {
              name: "My Calendars",
              items: ["Personal", "Work", "Family"],
            },
            {
              name: "Favorites",
              items: ["Holidays", "Birthdays"],
            },
            {
              name: "Other",
              items: ["Travel", "Reminders", "Deadlines"],
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus className="mr-2 h-4 w-4" />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
