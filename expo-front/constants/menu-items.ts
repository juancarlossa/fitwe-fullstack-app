// Definido fuera del componente: no se recrea en cada render

import { Calendar, ChartGantt, Dumbbell, LayoutDashboard, User } from "lucide-react-native";

export type MenuItemType = {
    label: string;
    href: string
    icon: any;
    active: boolean;
};

export const menuItems: MenuItemType[] = [
    { icon: LayoutDashboard, label: "Inicio", active: true, href: "/" },
    { icon: User, label: "Perfil", active: false, href: "/profile" },
    { icon: Dumbbell, label: "Ejercicios", active: false, href: "/ejercicios" },
    { icon: ChartGantt, label: "Entrenamientos", active: false, href: "/entrenamientos" },
    { icon: Calendar, label: "Clases", active: false, href: "/clases" },
];