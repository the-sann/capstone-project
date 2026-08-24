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
import { Dentist, Patient } from '@/types/app/types';

interface PatientFormData {
    patient_id: string;
    name: string;
    age: string;
    gender: string;
    address: string;
    phone: string;
}

interface DentistFormProps {
    data: PatientFormData;
    setData: (
        key: keyof PatientFormData,
        value: PatientFormData[keyof PatientFormData],
    ) => void;
    errors: Partial<Record<keyof PatientFormData, string>>;
    clearErrors: (field: keyof PatientFormData) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    patient?: Patient;
}

export default function PatientForm({
    data,
    setData,
    errors,
    clearErrors,
    processing,
    onSubmit,
    patient,
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
                            onChange={(e) => {
                                setData('name', e.target.value);
                                clearErrors('name');
                            }}
                            placeholder="Patient Name"
                            aria-invalid={!!errors.name}
                        />

                        {errors.name && <FieldError>{errors.name}</FieldError>}
                    </Field>
                    {/* gender */}
                    <Field>
                        <FieldLabel>Gender</FieldLabel>

                        <Select
                            value={data.gender}
                            onValueChange={(value) => {
                                setData('gender', value);
                                clearErrors('gender');
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>

                        {errors.gender && (
                            <FieldError>{errors.gender}</FieldError>
                        )}
                    </Field>
                    {/* age */}
                    <Field>
                        <FieldLabel htmlFor="age">Age</FieldLabel>

                        <Input
                            id="age"
                            name="age"
                            type="text"
                            min="0"
                            value={data.age}
                            onChange={(e) => {
                                setData('age', e.target.value);
                                clearErrors('age');
                            }}
                            placeholder="5"
                            aria-invalid={!!errors.age}
                        />

                        <FieldDescription>How old is patient?</FieldDescription>

                        {errors.age && <FieldError>{errors.age}</FieldError>}
                    </Field>

                    {/* phone */}
                    <Field>
                        <FieldLabel htmlFor="phone">Phone</FieldLabel>

                        <Input
                            id="phone"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => {
                                setData('phone', e.target.value);
                                clearErrors('phone');
                            }}
                            placeholder="Phone"
                            aria-invalid={!!errors.phone}
                        />

                        {errors.phone && (
                            <FieldError>{errors.phone}</FieldError>
                        )}
                    </Field>
                    {/* address */}
                    <Field>
                        <FieldLabel htmlFor="address">Address</FieldLabel>

                        <Input
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={(e) => {
                                setData('address', e.target.value);
                                clearErrors('address');
                            }}
                            placeholder="Address"
                            aria-invalid={!!errors.address}
                        />

                        {errors.address && (
                            <FieldError>{errors.address}</FieldError>
                        )}
                    </Field>
                </FieldGroup>
            </CardContent>

            <CardFooter className="pt-4">
                <div className="flex w-full justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setData('name', '');
                            setData('age', '');
                            setData('phone', '');
                            setData('address', '');
                            setData('gender', '');
                            setData('patient_id', '');
                        }}
                    >
                        Reset
                    </Button>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? patient
                                ? 'Updating'
                                : 'Creating...'
                            : patient
                              ? 'Update Patient'
                              : 'Create Patient'}
                    </Button>
                </div>
            </CardFooter>
        </form>
    );
}
