import { Dentist } from '@/types/app/dentists/dentist';
import { useForm } from '@inertiajs/react';

interface Props {
    dentist: Dentist;
}

export default function Edit({ dentist }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: dentist.name,
        year_experienced: dentist.year_experienced,
        skill: dentist.skill,
        status: dentist.status,
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/dentists/${dentist.id}`);
    }
}
