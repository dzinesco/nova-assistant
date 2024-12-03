import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background gradient with animated rotation */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10 animate-gradient pointer-events-none" />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-float" />
      </div>
      
      {/* Background grid */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        }}
      />

      {/* Content */}
      {mounted && (
        <div className="relative flex">
          <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
          <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
            <div className="container mx-auto p-8 space-y-6">
              {/* Page content wrapper */}
              <div className="relative">
                {/* Multi-layer glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient" />
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-primary/30 to-accent/20 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-gradient-slow" />
                
                {/* Content */}
                <div className="relative bg-card/30 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl">
                  <div className="relative p-6">
                    {/* Inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl" />
                    
                    {/* Content container */}
                    <div className="relative">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default Layout;
