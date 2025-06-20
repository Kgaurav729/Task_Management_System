import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  SidebarLeft
} from '@/components/sidebar-left'; // You can combine these if needed
import { SidebarRight } from './sidebar-right';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Bell } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarSrc = user?.avatar?.startsWith('http')
    ? user.avatar
    : `http://localhost:8081${user?.avatar}`;

  return (
    <SidebarProvider>
      {/* Sidebar Navigation */}
      <SidebarLeft></SidebarLeft>
      {/* <SidebarLeft> */}
        {/* <div className="flex flex-col h-full p-4 space-y-2 text-white bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">FreelancerDash</h2>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => navigate('/clients')}
          >
            Clients
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-red-400 mt-auto"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </SidebarLeft> */}

      {/* Main Layout */}
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center justify-between bg-white dark:bg-gray-800 px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* User Actions */}
        </header>

        {/* Routed content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </SidebarInset>

      <SidebarRight />
    </SidebarProvider>
  );
}


