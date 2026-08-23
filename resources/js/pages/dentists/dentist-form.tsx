import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
import { Dentist } from '@/types/app/types';

interface DentistFormData {
    name: string;
    year_experienced: string;
    skill: string;
    status: boolean;
    image: File | string | null;
    user_type: string;
}

interface DentistFormProps {
    data: DentistFormData;
    setData: (
        key: keyof DentistFormData,
        value: DentistFormData[keyof DentistFormData],
    ) => void;
    errors: Partial<Record<keyof DentistFormData, string>>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    dentist?: Dentist;
}

export default function DentistForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    dentist,
}: DentistFormProps) {
    return (
        <form onSubmit={onSubmit}>
            <CardContent>
                <FieldGroup>
                    {/* Name */}
                    <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Dr. John Smith"
                            aria-invalid={!!errors.name}
                        />
                        {errors.name && <FieldError>{errors.name}</FieldError>}
                    </Field>
                    {/* user_type */}
                    <Field>
                        <FieldLabel>User Type</FieldLabel>

                        <Select
                            value={data.user_type}
                            onValueChange={(value) => {
                                setData('user_type', value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select user type" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="dentist">Dentist</SelectItem>
                                <SelectItem value="cashier">Cashier</SelectItem>
                                <SelectItem value="receptionist">
                                    Receptionist
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.user_type && (
                            <FieldError>{errors.user_type}</FieldError>
                        )}
                    </Field>

                    {/* display image */}
                    {dentist?.image_path && (
                        <img
                            src={dentist.image_path}
                            alt={dentist.name}
                            className="w-64"
                        />
                    )}
                    {/* profile_image */}
                    <Field>
                        <FieldLabel htmlFor="profile_image">
                            Profile Image
                        </FieldLabel>
                        <Input
                            id="image"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={(e) =>
                                setData('image', e.target.files?.[0] ?? null)
                            }
                        />

                        {errors.image && (
                            <FieldError>{errors.image}</FieldError>
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
                                setData('year_experienced', e.target.value)
                            }
                            placeholder="5"
                            aria-invalid={!!errors.year_experienced}
                        />

                        <FieldDescription>
                            How many years of dental experience?
                        </FieldDescription>

                        {errors.year_experienced && (
                            <FieldError>{errors.year_experienced}</FieldError>
                        )}
                    </Field>

                    {/* Skill */}
                    <Field>
                        <FieldLabel htmlFor="skill">Skill</FieldLabel>

                        <Input
                            id="skill"
                            name="skill"
                            value={data.skill}
                            onChange={(e) => setData('skill', e.target.value)}
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

                        <FieldLabel htmlFor="status" className="font-normal">
                            Active
                        </FieldLabel>
                    </Field>

                    {errors.status && <FieldError>{errors.status}</FieldError>}
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
                            setData('user_type', '');
                            setData('image', null);
                        }}
                    >
                        Reset
                    </Button>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? dentist
                                ? 'Updating...'
                                : 'Creating...'
                            : dentist
                              ? 'Update Dentist'
                              : 'Create Dentist'}
                    </Button>
                </div>
            </CardFooter>
        </form>
    );
}
