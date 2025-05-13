
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Clipboard,
  CheckSquare,
  Users,
  ClipboardCheck,
  FilePlus,
  BarChart,
  Settings,
  Package,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarProvider, Sidebar as BaseSidebar, SidebarContent } from '@/components/ui/sidebar';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon, label, href, active, isCollapsed, onClick }: NavItemProps) => {
  return (
    <Link 
      to={href} 
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        active 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
}

const NavGroup = ({ title, children, isCollapsed }: NavGroupProps) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (isCollapsed) {
    return (
      <div className="py-2">
        {children}
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="py-2">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex items-center justify-between w-full px-3 py-1 text-xs uppercase tracking-wider font-semibold text-sidebar-foreground/60">
          {title}
          <span className={cn('transition-transform', isOpen ? 'rotate-0' : 'rotate-180')}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
};

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const [activeItem, setActiveItem] = React.useState('/');
  
  const handleNavigation = (path: string) => {
    setActiveItem(path);
  };
  
  const iconClasses = "h-5 w-5";
  
  return (
    <BaseSidebar>
      <SidebarContent>
        <div className="py-4">
          <NavGroup title="Documents" isCollapsed={isCollapsed}>
            <NavItem 
              icon={<FileText className={iconClasses} />} 
              label="Document Control" 
              href="/documents" 
              active={activeItem === '/documents'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/documents')}
            />
          </NavGroup>
          
          <NavGroup title="Quality Processes" isCollapsed={isCollapsed}>
            <NavItem 
              icon={<AlertTriangle className={iconClasses} />} 
              label="CAPA" 
              href="/capa" 
              active={activeItem === '/capa'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/capa')}
            />
            <NavItem 
              icon={<Clipboard className={iconClasses} />} 
              label="Complaints" 
              href="/complaints" 
              active={activeItem === '/complaints'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/complaints')}
            />
            <NavItem 
              icon={<CheckSquare className={iconClasses} />} 
              label="Audits" 
              href="/audits" 
              active={activeItem === '/audits'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/audits')}
            />
            <NavItem 
              icon={<ClipboardCheck className={iconClasses} />} 
              label="Non-Conformance" 
              href="/nonconformance" 
              active={activeItem === '/nonconformance'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/nonconformance')}
            />
            <NavItem 
              icon={<Shield className={iconClasses} />} 
              label="Risk Management" 
              href="/risk" 
              active={activeItem === '/risk'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/risk')}
            />
            <NavItem 
              icon={<FilePlus className={iconClasses} />} 
              label="Change Control" 
              href="/change" 
              active={activeItem === '/change'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/change')}
            />
          </NavGroup>
          
          <NavGroup title="People" isCollapsed={isCollapsed}>
            <NavItem 
              icon={<Users className={iconClasses} />} 
              label="Training" 
              href="/training" 
              active={activeItem === '/training'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/training')}
            />
          </NavGroup>
          
          <NavGroup title="Products" isCollapsed={isCollapsed}>
            <NavItem 
              icon={<Package className={iconClasses} />} 
              label="Product Lifecycle" 
              href="/products" 
              active={activeItem === '/products'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/products')}
            />
            <NavItem 
              icon={<Users className={iconClasses} />} 
              label="Supplier Management" 
              href="/suppliers" 
              active={activeItem === '/suppliers'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/suppliers')}
            />
          </NavGroup>
          
          <NavGroup title="Analytics" isCollapsed={isCollapsed}>
            <NavItem 
              icon={<BarChart className={iconClasses} />} 
              label="Dashboards" 
              href="/" 
              active={activeItem === '/'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/')}
            />
          </NavGroup>
          
          <NavGroup title="Admin" isCollapsed={isCollapsed}>
            <NavItem 
              icon={<Settings className={iconClasses} />} 
              label="Settings" 
              href="/settings" 
              active={activeItem === '/settings'}
              isCollapsed={isCollapsed}
              onClick={() => handleNavigation('/settings')}
            />
          </NavGroup>
        </div>
      </SidebarContent>
    </BaseSidebar>
  );
};

export default Sidebar;
