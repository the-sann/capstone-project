import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings, Languages, Palette } from 'lucide-react';

import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import { edit as editAppearance } from '@/routes/appearance';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const { locale } = usePage().props;

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const switchLanguage = (lang: 'en' | 'km') => {
        router.post(`/language/${lang}`);
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
                {/* Profile / Settings */}
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>

                {/* Appearance */}
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={editAppearance()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Palette className="mr-2 h-4 w-4" />
                        Appearance
                    </Link>
                </DropdownMenuItem>

                {/* Language */}
                <DropdownMenuItem
                    onClick={() =>
                        switchLanguage(locale === 'en' ? 'km' : 'en')
                    }
                >
                    <Languages className="mr-2 h-4 w-4" />

                    {locale === 'en' ? 'ខ្មែរ' : 'English'}
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
