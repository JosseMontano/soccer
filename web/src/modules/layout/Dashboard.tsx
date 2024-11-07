import clsx from "clsx";
import { NavLink, Outlet } from "react-router-dom";
import Icon from "../core/components/icons/Icon";
import { motion } from "framer-motion";

const DATA = [
  {
    to: "/home",
    icon: Icon.Types.HOME,
  },
  {
    to: "/",
    icon: Icon.Types.PLAYER,
  },
  {
    to: "/clubs",
    icon: Icon.Types.SHIELD,
  },
];

const Dashboard = () => {
  const MotionLink = motion(NavLink, {
    forwardMotionProps: true,
  });

  return (
    <div className="w-screen h-[100svh] flex">
      <aside className="h-full py-20 flex flex-col items-center justify-between w-16 shadow-xl shadow-primary-300 z-10">
        <div className="flex flex-col gap-6">
          {DATA.map((link) => (
            <MotionLink
              to={link.to}
              animate={{
                scale: 1,
              }}
              whileTap={{
                scale: 1.4,
              }}
              className={({ isActive }) =>
                clsx(
                  "p-2 w-10 aspect-square border rounded-full transition-colors duration-300",
                  {
                    "bg-primary-500 border-primary-500 text-white": isActive,
                    "bg-white border-primary-200 text-primary-400": !isActive,
                  }
                )
              }
            >
              <Icon type={link.icon} />
            </MotionLink>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <button className="p-2 w-10 aspect-square text-primary-400">
            <Icon type={Icon.Types.SETTINGS} />
          </button>
        </div>
      </aside>
      <div className="h-full overflow-auto bg-primary-50 flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
