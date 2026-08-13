import { Head, useForm } from '@inertiajs/react';
import dentists from '@/routes/dentists';

import { Button } from '@/components/ui/button';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';

import { Input } from '@/components/ui/input';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        year_experienced: '',
        skill: '',
        status: true,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post(dentists.store().url);
    }

    return (
        <>
            <Head title="Create Dentist" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Create Dentist</h1>

                <Card className="w-full sm:max-w-md">
                    <CardHeader>
                        <CardTitle>Create Dentist</CardTitle>

                        <CardDescription>
                            Enter the dentist's information below.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={submit}>
                        <CardContent>
                            <FieldGroup>
                                {/* Name */}
                                <Field>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Dr. John Smith"
                                        aria-invalid={!!errors.name}
                                    />

                                    {errors.name && (
                                        <FieldError>{errors.name}</FieldError>
                                    )}
                                </Field>

                                {/* Years Experienced */}
                                <Field>
                                    <FieldLabel htmlFor="year_experienced">
                                        Years Experienced
                                    </FieldLabel>

                                    <Input
                                        id="year_experienced"
                                        name="year_experienced"
                                        type="text"
                                        min="0"
                                        value={data.year_experienced}
                                        onChange={(e) =>
                                            setData(
                                                'year_experienced',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="5"
                                        aria-invalid={!!errors.year_experienced}
                                    />

                                    <FieldDescription>
                                        How many years of dental experience?
                                    </FieldDescription>

                                    {errors.year_experienced && (
                                        <FieldError>
                                            {errors.year_experienced}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* Skill */}
                                <Field>
                                    <FieldLabel htmlFor="skill">
                                        Skill
                                    </FieldLabel>

                                    <Input
                                        id="skill"
                                        name="skill"
                                        value={data.skill}
                                        onChange={(e) =>
                                            setData('skill', e.target.value)
                                        }
                                        placeholder="Orthodontics"
                                        aria-invalid={!!errors.skill}
                                    />

                                    {errors.skill && (
                                        <FieldError>{errors.skill}</FieldError>
                                    )}
                                </Field>

                                {/* Status */}
                                <Field orientation="horizontal">
                                    <input
                                        id="status"
                                        name="status"
                                        type="checkbox"
                                        checked={data.status}
                                        onChange={(e) =>
                                            setData('status', e.target.checked)
                                        }
                                    />

                                    <FieldLabel
                                        htmlFor="status"
                                        className="font-normal"
                                    >
                                        Active
                                    </FieldLabel>
                                </Field>

                                {errors.status && (
                                    <FieldError>{errors.status}</FieldError>
                                )}
                            </FieldGroup>
                        </CardContent>

                        <CardFooter>
                            <div className="flex w-full justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setData('name', '');
                                        setData('year_experienced', '');
                                        setData('skill', '');
                                        setData('status', true);
                                    }}
                                >
                                    Reset
                                </Button>

                                <Button type="submit" disabled={processing}>
                                    {processing
                                        ? 'Creating...'
                                        : 'Create Dentist'}
                                </Button>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Dentist',
            href: dentists.create(),
        },
    ],
};
