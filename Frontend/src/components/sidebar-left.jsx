import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming className merger helper exists

export function SidebarLeft(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      category: 'Main',
      links: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/dashboard',
        },
        {
          label: 'Clients',
          icon: Users,
          path: '/clients',
        },
      ],
    },
    {
      category: 'Account',
      links: [
        {
          label: 'Logout',
          icon: LogOut,
          onClick: handleLogout,
          isDanger: true,
        },
      ],
    },
  ];

  return (
    <Sidebar className="border-r-0 bg-gray-800 text-white" {...props}>
      <SidebarHeader>
        <div className="text-xl font-semibold px-4 py-3">FreelancerDash</div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 space-y-6">
        {navItems.map((section, idx) => (
          <div key={idx}>
            <h4 className="px-3 mb-2 text-xs font-semibold uppercase text-gray-400">
              {section.category}
            </h4>
            <div className="space-y-1">
              {section.links.map((item, linkIdx) => {
                const isActive = item.path && location.pathname.startsWith(item.path);
                const Icon = item.icon;

                return (
                  <button
                    key={linkIdx}
                    onClick={() => (item.onClick ? item.onClick() : navigate(item.path))}
                    className={cn(
                      'flex items-center w-full gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      item.isDanger && 'text-red-400 hover:text-red-300'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
