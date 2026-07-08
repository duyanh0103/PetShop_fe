import { NavLink } from "react-router-dom";
import { sidebarMenu } from "@/data/menu";

// giả lập user role (sau này lấy từ store/JWT)
const currentUserRole = "ADMIN";

export default function Sidebar() {
  // 1. filter theo role
  const filteredMenu = sidebarMenu.filter((item) => {
    if (!item.roles) return true; // nếu không khai báo roles => public
    return item.roles.includes(currentUserRole);
  });

  // 2. group menu
  const groupedMenu = filteredMenu.reduce((acc, item) => {
    const group = item.group || "OTHER";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h1 className="text-xl font-bold mb-6">PetShop Admin</h1>

      <div className="space-y-6">
        {Object.entries(groupedMenu).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs text-gray-400 uppercase mb-2">
              {group}
            </p>

            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon; // ⚠ quan trọng

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-2 p-2 rounded transition ${
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100"
                      }`
                    }
                  >
                    {Icon && <Icon size={18} />}
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}