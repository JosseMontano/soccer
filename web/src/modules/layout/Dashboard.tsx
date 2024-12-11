import clsx from "clsx";
import { NavLink, Outlet } from "react-router-dom";
import Icon from "../core/components/icons/Icon";
import { motion } from "framer-motion";
import useUserStore from "../core/store/userStore";
import Modal from "../core/components/ui/Modal";
import LoginPage from "../features/login/pages/LoginPage";
import { toastConfirm, toastSuccess } from "../core/utils/toast";

const DATA = [
  {
    to: "/home",
    name: "Inicio",
    icon: Icon.Types.HOME,
    role: ["1", "2", "3", "4"],
  },
  {
    to: "/",
    name: "Jugadores",
    icon: Icon.Types.PLAYER,
    role: ["1", "2"],
  },
  {
    to: "/clubs",
    name: "Clubs",
    icon: Icon.Types.SHIELD,
    role: ["1", "2"],
  },
  {
    to: "/tournament",
    name: "Torneos",
    icon: Icon.Types.SHIELD,
    role: ["1", "2"],
  },
];

const Dashboard = () => {
  const { user, logout } = useUserStore();
  const MotionLink = motion(NavLink, {
    forwardMotionProps: true,
  });

  const handlelogout = () => {
    toastConfirm("¿Quieres cerrar sesion?", () => {
      logout()
      toastSuccess("Se cerro sesion");
    });
  };

  return (
    <div className="w-screen h-[100svh] flex flex-col">
      <aside className="w-full px-10 py-6 flex items-center justify-between z-10 bg-gray-900">
        <div className="flex gap-6">
          {DATA.map((link) =>
            link.role.map(
              (v) =>
                v == user?.roleId && (
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
                        "p-2 h-max border rounded-xl transition-colors duration-300 flex items-center gap-2 text-sm",
                        {
                          "bg-skyblue-500 border-skyblue-500 text-white":
                            isActive,
                          "bg-white border-skyblue-200 text-skyblue-400":
                            !isActive,
                        }
                      )
                    }
                  >
                    <div className="aspect-square">
                      <Icon type={link.icon} />
                    </div>
                    <p>{link.name}</p>
                  </MotionLink>
                )
            )
          )}
        </div>

        <div className="flex flex-row items-center gap-6">
          <div>{user && user?.email}</div>
          <button className="p-2 w-10 aspect-square text-skyblue-400">
            {!user && (
              <Modal
                title={"Inicia sesion"}
                description="Para poder crear y alterar datos necesitas estar logueado"
                button={
                  <span className="cursor-pointer">
                    <Icon type={Icon.Types.USER} />
                  </span>
                }
              >
                <LoginPage />
              </Modal>
            )}

            {user && (
              <span className="cursor-pointer" onClick={handlelogout}>
                <Icon type={Icon.Types.LOGOUT} />
              </span>
            )}
          </button>
        </div>
      </aside>
      <div className="h-full overflow-auto flex-1 bg-gray-950 text-white flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
