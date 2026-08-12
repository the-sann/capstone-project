import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex items-center">
                <span className="truncate text-lg font-bold">
                    Dental Clinic System
                </span>
            </div>
        </>
    );
}
