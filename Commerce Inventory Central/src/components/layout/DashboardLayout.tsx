import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Package2,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  AlertTriangle,
  Home,
  Package,
  ClipboardList
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: string;
}

const navigation: NavItem[] = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Package, label: 'Products', href: '/products' },
  { icon: ShoppingCart, label: 'Orders', href: '/orders', badge: '12' },
  { icon: Package2, label: 'Inventory', href: '/inventory' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-background border-r border-sidebar-border">
        {/* Logo/Header */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <Package2 className="h-8 w-8 text-sidebar-primary" />
          <span className="ml-3 text-lg font-semibold text-sidebar-foreground">
            Inventory Pro
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                )}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Alert Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-warning mr-2" />
              <div className="flex-1 text-xs">
                <p className="font-medium text-sidebar-foreground">Low Stock Alert</p>
                <p className="text-sidebar-foreground/70">5 items need restock</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-semibold text-foreground">
              {navigation.find(item => item.href === location.pathname)?.label || 'Dashboard'}
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Quick Stats in Header */}
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-success rounded-full"></div>
                  <span className="text-muted-foreground">System Online</span>
                </div>
                <div className="text-muted-foreground">
                  Last sync: 2 min ago
                </div>
              </div>
              
              {/* User Avatar Placeholder */}
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}