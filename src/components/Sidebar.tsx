import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getProjectsByType } from '../store/useStore';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const projects = useStore((s) => s.projects);
  const longTerm = getProjectsByType(projects, 'long-term');
  const shortTerm = getProjectsByType(projects, 'short-term');

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} border-r border-gray-200 bg-gray-50 flex flex-col transition-all duration-200`}>
      <div className={`${collapsed ? 'px-2' : 'p-6'} flex items-center gap-3`}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
            </svg>
            <div>
              <h1 className="text-xl font-bold text-gray-900">日进一步</h1>
              <p className="text-xs text-gray-400 mt-0.5">你本来就该如此美好</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {!collapsed && (
        <nav className="flex-1 px-3 space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm rounded-r-lg ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            总览
          </NavLink>

          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm rounded-r-lg ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            日历
          </NavLink>

          <div className="pt-4" />

          <NavLink
            to="/long-term"
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm rounded-r-lg flex items-center justify-between ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <span className="font-medium">长期项目</span>
            <span className="text-xs text-gray-400">月总结 · 季度收获</span>
          </NavLink>

          {longTerm.map((p) => (
            <NavLink
              key={p.id}
              to={`/long-term/${p.id}`}
              className={({ isActive }) =>
                `block px-8 py-2 text-sm rounded-r-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }} />
              {p.name}
            </NavLink>
          ))}

          <div className="pt-4" />

          <NavLink
            to="/short-term"
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm rounded-r-lg flex items-center justify-between ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <span className="font-medium">短期项目</span>
            <span className="text-xs text-gray-400">周总结 · 月度收获</span>
          </NavLink>

          {shortTerm.map((p) => (
            <NavLink
              key={p.id}
              to={`/short-term/${p.id}`}
              className={({ isActive }) =>
                `block px-8 py-2 text-sm rounded-r-lg ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: p.color }} />
              {p.name}
            </NavLink>
          ))}

          <div className="pt-4" />

          <NavLink
            to="/archive"
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm rounded-r-lg ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            归档
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block px-4 py-2.5 text-sm rounded-r-lg ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            设置
          </NavLink>
        </nav>
      )}
    </aside>
  );
}
