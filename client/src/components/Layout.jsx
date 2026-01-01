// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import Navbar from './Navbar';

// const Layout = ({ children }) => {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   return (
//     <div className="d-flex">
//       <Sidebar 
//         collapsed={sidebarCollapsed} 
//         toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
//       />
      
//       <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`} style={{ flex: 1, width: '100%' }}>
//         <Navbar sidebarCollapsed={sidebarCollapsed} />
        
//         <div className="p-4" style={{ backgroundColor: '#f5f5f9', minHeight: 'calc(100vh - 70px)' }}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="d-flex layout-root">
      <Sidebar
        collapsed={sidebarCollapsed}
        toggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`main-content ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
        style={{ flex: 1, width: "100%" }}
      >
        <Navbar sidebarCollapsed={sidebarCollapsed} />

        {/* ✅ THEME-AWARE CONTENT WRAPPER */}
        <div className="layout-content p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
