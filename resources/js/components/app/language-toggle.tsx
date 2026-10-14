import { router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function LanguageToggle() {
    const { locale } = usePage().props;

    const switchLanguage = (lang: 'en' | 'km') => {
        router.post(`/language/${lang}`);
    };

    return (
        <Button
            variant="outline"
            onClick={() => switchLanguage(locale === 'en' ? 'km' : 'en')}
        >
            {locale === 'en' ? 'English' : 'ខ្មែរ'}
        </Button>
    );
}
