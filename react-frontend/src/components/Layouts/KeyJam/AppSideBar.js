import { useState } from 'react';
import { classNames } from 'primereact/utils';
import { Ripple } from 'primereact/ripple';

import AppSideBarProvider from './AppSideBarProvider.js';
import AppFooter from '../AppFooter.js';

// Import Lucide React icons
import { 
  LayoutDashboard, 
  BookOpen, 
  Music, 
  Library, 
  ChevronRight,
  MenuIcon
} from 'lucide-react';

const AppSideBar = (props) => {
    const { activeKey: initialActiveKey } = props;
    const [activeKey, setActiveKey] = useState(initialActiveKey);
    const [open, setOpen] = useState(true);

    const menuItems = [
      {
        icon: <LayoutDashboard size={20} />,
        label: "Dashboard",
        key: "dashboard",
        path: "/dashboard"
      },
      {
        icon: <BookOpen size={20} />,
        label: "Lessons",
        key: "lessons",
        path: "/lessons"
      },
      {
        icon: <Music size={20} />,
        label: "Chord Sheets",
        key: "chord-sheets",
        path: "/chord-sheets"
      },
      {
        icon: <Library size={20} />,
        label: "Chord Book",
        key: "chord-book",
        path: "/chord-book"
      }
    ];

    return (
        <>
            <div className={classNames('duration-300 flex-shrink-0', open ? 'w-[240px]' : 'w-[70px]')}></div>
            <AppSideBarProvider activeKey={activeKey} setActiveKey={setActiveKey} open={open} setOpen={setOpen}>
                <div className={classNames(
                  'fixed z-[100] flex flex-col top-20 left-0 h-[calc(100vh-5rem)] overflow-y-auto',
                  'shadow bg-white border-r border-gray-200 duration-300',
                  open ? 'w-[240px]' : 'w-[70px]'
                )}>
                    <div className="flex-grow p-3">
                        {/* Toggle button */}
                        <div className="flex items-center justify-between mb-6 px-2">
                            {open && <span className="font-semibold text-blue-600">KeyJam</span>}
                            <button 
                              onClick={() => setOpen(!open)} 
                              className="p-2 rounded-full hover:bg-gray-100"
                            >
                              <MenuIcon size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Navigation links */}
                        <nav>
                            <ul className="space-y-2">
                                {menuItems.map((item) => (
                                    <li key={item.key}>
                                        <a 
                                          href={item.path}
                                          className={classNames(
                                            'flex items-center p-3 rounded-lg transition-colors p-ripple',
                                            'hover:bg-blue-50 relative overflow-hidden',
                                            activeKey === item.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                          )}
                                          onClick={() => setActiveKey(item.key)}
                                        >
                                            <span className="text-inherit">{item.icon}</span>
                                            {open && (
                                              <>
                                                <span className="ml-3 text-inherit">{item.label}</span>
                                                <ChevronRight size={16} className="ml-auto text-gray-400" />
                                              </>
                                            )}
                                            <Ripple />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    
                    {open && (
                      <div className="p-3 mt-auto border-t border-gray-200">
                        <AppFooter />
                      </div>
                    )}
                </div>
            </AppSideBarProvider>
        </>
    );
};

export default AppSideBar;