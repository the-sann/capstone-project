import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import dentists from '@/routes/dentists';
import servicesTreatments from '@/routes/services-treatments';
import treatments from '@/routes/treatments';
import { Dentist, Treatment } from '@/types/app/types';
import { Head, Link } from '@inertiajs/react';
interface Props {
    treatment: Treatment;
}
export default function Show({ treatment }: Props) {
    console.log(treatment);
    return (
        <>
            <Head title={`treatment - ${treatment.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flow-root">
                    <dl className="-my-3 divide-y divide-gray-200 text-sm">
                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-medium text-gray-900">Name</dt>

                            <dd className="text-gray-700 sm:col-span-2">
                                {treatment.name}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-medium text-gray-900">
                                Status
                            </dt>

                            <dd className="text-gray-700 sm:col-span-2">
                                {treatment.status}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-medium text-gray-900">
                                Durations
                            </dt>

                            <dd className="text-gray-700 sm:col-span-2">
                                {treatment.duration} min
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-medium text-gray-900">Price</dt>

                            <dd className="text-gray-700 sm:col-span-2">
                                ${treatment.price}
                            </dd>
                        </div>

                        <div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
                            <dt className="font-medium text-gray-900">
                                Description
                            </dt>

                            <dd className="text-gray-700 sm:col-span-2">
                                {treatment.description}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
}
Show.layout = {
    breadcrumbs: [
        {
            title: 'Treatment',
            href: treatments.index(),
        },
        {
            title: 'Treatment Services',
            href: servicesTreatments.index(),
        },
        {
            title: 'Show',
            href: '#',
        },
    ],
};
