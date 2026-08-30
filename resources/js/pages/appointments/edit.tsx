import appointments from '@/routes/appointments';

export default function Edit() {
    return <></>;
}
Edit.layout = {
    breadcrumbs: [
        {
            title: 'Eidit',
            href: appointments.index(),
        },
    ],
};
