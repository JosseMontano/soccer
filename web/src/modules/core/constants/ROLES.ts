import { User } from "../store/userStore";

export const ROLES = {
    1: "superAdmin",
    2: "admin",
    3: "manager",
    4: "user",
};

export const AdminPermissos = (user: User | null) => {
    return user?.roleId == "2" || user?.roleId == "1"
}