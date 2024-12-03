import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { 
  RiDashboardLine,
  RiCalendarLine,
  RiMessage2Line,
  RiTaskLine,
  RiSettings4Line,
  RiAppsLine,
  RiRobot2Line,
  RiHomeLine,
  RiNotification2Line,
  RiSunLine,
  RiMoonLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from 'react-icons/ri';

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const menuItems = [
  { icon: RiDashboardLine, label: 'Dashboard', path: '/' },
  { icon: RiCalendarLine, label: 'Calendar', path: '/calendar' },
  { icon: RiMessage2Line, label: 'Messages', path: '/messages' },
  { icon: RiTaskLine, label: 'Tasks', path: '/tasks' },
  { icon: RiAppsLine, label: 'Integrations', path: '/integrations' },
  { icon: RiRobot2Line, label: 'AI Assistant', path: '/assistant' },
  { icon: RiNotification2Line, label: 'Notifications', path: '/notifications' },
  { icon: RiSettings4Line, label: 'Settings', path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed = false, 
  onCollapse = () => {} 
}) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen bg-card/20 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-40 transition-all duration-300 group ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo Section */}
        <div className="relative flex items-center justify-center h-20 px-6 border-b border-white/10">
          <div className="relative w-10 h-10">
            {/* Logo glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-xl blur-lg animate-pulse-slow" />
            <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary/80 to-accent rounded-xl flex items-center justify-center shadow-xl">
              <RiHomeLine className="w-6 h-6 text-white animate-glow" />
            </div>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <span className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Nova</span>
              <span className="text-lg font-medium"> Assistant</span>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {menuItems.map(({ icon: Icon, label, path }) => {
              const isActive = router.pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className={`
                    flex items-center px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-primary/20 to-accent/20 text-primary shadow-lg' 
                      : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                    }
                    ${isActive ? 'border border-primary/20' : ''}
                    group/item relative overflow-hidden
                  `}
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 blur" />
                  
                  <Icon className={`
                    relative w-6 h-6 transition-all duration-300
                    ${collapsed ? 'scale-110' : ''}
                    ${isActive ? 'text-primary animate-glow' : 'text-muted-foreground group-hover/item:text-foreground'}
                  `} />
                  
                  {!collapsed && (
                    <span className="relative ml-3 font-medium">{label}</span>
                  )}

                  {/* Active indicator */}
                  {isActive && !collapsed && (
                    <div className="absolute right-4 w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10">
          <div className={`
            relative flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-card/30 to-secondary/30 backdrop-blur-sm overflow-hidden
            ${collapsed ? 'flex-col space-y-4' : 'space-x-4'}
          `}>
            {/* Background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-gradient opacity-50" />
            
            <div className={`relative flex items-center ${collapsed ? 'flex-col' : 'space-x-3'}`}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-glow">
                <span className="text-white font-medium animate-glow">N</span>
              </div>
              {!collapsed && (
                <div>
                  <p className="text-sm font-medium">Nova AI</p>
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
              )}
            </div>
            <div className="relative flex items-center space-x-2">
              <button
                onClick={() => onCollapse(!collapsed)}
                className="p-2 rounded-lg bg-card/30 backdrop-blur-sm border border-white/10 hover:bg-card/50 hover:border-primary/50 hover:shadow-glow transition-all duration-300"
              >
                {collapsed ? (
                  <RiMenuUnfoldLine className="w-4 h-4" />
                ) : (
                  <RiMenuFoldLine className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-card/30 backdrop-blur-sm border border-white/10 hover:bg-card/50 hover:border-primary/50 hover:shadow-glow transition-all duration-300"
              >
                {theme === 'dark' ? (
                  <RiSunLine className="w-4 h-4" />
                ) : (
                  <RiMoonLine className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
