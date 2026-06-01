import React from "react";
import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface Tab {
  to: string;
  label: string;
  Icon: LucideIcon;
  badge?: number;
}

interface Props {
  tabs: Tab[];
}

/**
 * Bottom Tab Bar fixa em mobile. Em telas md+ não renderiza
 * (desktop usa header horizontal).
 */
export const BottomTabBar: React.FC<Props> = ({ tabs }) => {
  const { pathname } = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
      aria-label="Navegação principal"
    >
      <ul className="flex justify-around items-center h-16 pb-safe">
        {tabs.map(({ to, label, Icon, badge }) => {
          const ativo = pathname === to || pathname.startsWith(to + "/");
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center justify-center gap-0.5 py-2 px-1 transition-colors ${
                  ativo
                    ? "text-[#f9943b]"
                    : "text-[#394158]/60 hover:text-[#55833d]"
                }`}
              >
                <div className="relative">
                  <Icon size={22} />
                  {badge && badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
