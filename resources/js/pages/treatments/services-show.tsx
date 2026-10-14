import { Button } from '@/components/ui/button';
import servicesTreatments from '@/routes/services-treatments';
import treatmentRoutes from '@/routes/treatments';
import { Treatment } from '@/types/app/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
interface Props {
    treatments: Treatment[];
}
export default function Sevices({ treatments }: Props) {
    return (
        <>
            <Head title="Treat Service" />
            <div className="p-4">
                <div>
                    <p>search area</p>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {treatments.map((treatment) => (
                        <Link
                            href={treatmentRoutes.show(treatment.id).url}
                            key={treatment.id}
                        >
                            <div className="rounded-xl border p-6">
                                <h2 className="text-lg font-semibold">
                                    {treatment.name}
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    {treatment.description}
                                </p>

                                <div className="mt-4 space-y-2">
                                    <p>
                                        Price:{' '}
                                        <span className="font-medium">
                                            ${treatment.price}
                                        </span>
                                    </p>

                                    <p>
                                        Duration:{' '}
                                        <span className="font-medium">
                                            {treatment.duration} min
                                        </span>
                                    </p>

                                    <p>
                                        Status:{' '}
                                        <span className="font-medium">
                                            {treatment.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}
Sevices.layout = {
    breadcrumbs: [
        {
            title: 'Treatment',
            href: treatmentRoutes.index(),
        },
        {
            title: 'Treatment Services',
            href: servicesTreatments.index(),
        },
    ],
};
