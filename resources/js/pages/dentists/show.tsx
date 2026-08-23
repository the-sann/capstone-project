import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import dentists from '@/routes/dentists';
import { Dentist } from '@/types/app/types';
import { Head, Link } from '@inertiajs/react';
interface Props {
    dentist: Dentist;
}
export default function Show({ dentist }: Props) {
    console.log(dentist);
    return (
        <>
            <Head title={`Dentist - ${dentist.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <img
                    src={`/storage/${dentist.image_path}`}
                    alt=""
                    className="h-200 w-auto object-contain"
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{dentist.name}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            User Type
                        </p>
                        <p className="font-medium">{dentist.user_type}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Skill</p>
                        <p className="font-medium">{dentist.skill}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Experience
                        </p>
                        <p className="font-medium">
                            {dentist.year_experienced} years
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium">
                            {dentist.status ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
Show.layout = {
    breadcrumbs: [
        {
            title: 'Dentist',
            href: dentists.index(),
        },
        {
            title: 'Details Dentist',
            href: '#',
        },
    ],
};
