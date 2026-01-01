import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  PieChart,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ collapsed, toggleCollapse }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    {
      title: 'Dashboards',
      icon: LayoutDashboard,
      badge: '5',
      items: [
        { name: 'Analytics', path: '/dashboard', icon: BarChart3 }
      ]
    },
    {
      title: 'Charts',
      icon: BarChart3,
      items: [
        { name: 'Apex Charts', path: '/charts/apex', icon: PieChart },
        { name: 'Chart.js', path: '/charts/chartjs', icon: BarChart3 }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom" style={{ minHeight: '70px' }}>
        {!collapsed && (
          <div className="d-flex align-items-center">
            <div 
              className="bg-primary text-white rounded d-flex align-items-center justify-content-center" 
              style={{ width: '40px', height: '40px', fontSize: '20px', fontWeight: 'bold' }}
            >
              V
            </div>
            <span className="ms-2 fw-bold" style={{ fontSize: '1.2rem', color: '#5e5873' }}>Vuexy</span>
          </div>
        )}
        {collapsed && (
          <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center mx-auto" 
               style={{ width: '40px', height: '40px', fontSize: '20px', fontWeight: 'bold' }}>
            V
          </div>
        )}
        <button 
          className="btn btn-link p-0 text-secondary border-0 bg-transparent"
          onClick={toggleCollapse}
          style={{ border: 'none', background: 'none' }}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-2">
        {menuItems.map((section, sectionIndex) => {
          const hasSubItems = section.items && section.items.length > 0;
          const isExpanded = expandedMenus[section.title] || false;
          
          return (
            <div key={sectionIndex}>
              {!collapsed && (
                <div 
                  className="px-3 py-2 text-uppercase" 
                  style={{ fontSize: '0.75rem', color: '#b4b7bd', fontWeight: '600', letterSpacing: '0.5px' }}
                >
                  {section.title}
                </div>
              )}
              
              {hasSubItems && section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={itemIndex}
                    to={item.path}
                    className={`d-flex align-items-center px-3 py-2 text-decoration-none ${
                      active ? 'nav-item-active' : ''
                    }`}
                    style={{
                      color: active ? '#7367f0' : '#6e6b7b',
                      transition: 'all 0.2s',
                      marginLeft: active ? '0' : '3px'
                    }}
                  >
                    <Icon size={18} className={collapsed ? 'mx-auto' : ''} />
                    {!collapsed && (
                      <>
                        <span className="ms-3 flex-grow-1">{item.name}</span>
                        {section.badge && itemIndex === 0 && (
                          <span 
                            className="badge rounded-pill bg-danger ms-2" 
                            style={{ fontSize: '0.65rem', padding: '0.25rem 0.4rem' }}
                          >
                            {section.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
