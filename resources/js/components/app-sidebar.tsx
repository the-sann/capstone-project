import { Link } from '@inertiajs/react';
import {
    Activity,
    BookOpen,
    Box,
    CarTaxiFrontIcon,
    LayoutGrid,
    Timer,
    User2,
    UserCircle2,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import dentists from '@/routes/dentists';
import patients from '@/routes/patients';
import treatments from '@/routes/treatments';
import appointments from '@/routes/appointments';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Dentist',
        href: dentists.index(),
        icon: UserCircle2,
    },
    {
        title: 'Patients',
        href: patients.index(),
        icon: User2,
    },
    {
        title: 'Appointments',
        href: appointments.index(),
        icon: Timer,
    },

    {
        title: 'Treatment Services',
        href: treatments.index(),
        icon: Activity,
    },
    {
        title: 'Materials',
        href: dashboard(),
        icon: Box,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
