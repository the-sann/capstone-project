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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Treatment } from '@/types/app/types';

interface TreatmentFormData {
    name: string;
    description: string;
    price: string;
    duration: string;
    status: string;
}

interface TreatmentFormProps {
    data: TreatmentFormData;
    setData: (
        key: keyof TreatmentFormData,
        value: TreatmentFormData[keyof TreatmentFormData],
    ) => void;
    errors: Partial<Record<keyof TreatmentFormData, string>>;
    clearErrors: (field: keyof TreatmentFormData) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    treatment?: Treatment;
}

export default function TreatmentForm({
    data,
    setData,
    errors,
    clearErrors,
    processing,
    onSubmit,
    treatment,
}: TreatmentFormProps) {
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
                            placeholder="Serice name"
                            aria-invalid={!!errors.name}
                        />

                        {errors.name && <FieldError>{errors.name}</FieldError>}
                    </Field>

                    {/* description */}
                    <Field>
                        <FieldLabel htmlFor="description">
                            Description
                        </FieldLabel>

                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) => {
                                setData('description', e.target.value);
                                clearErrors('description');
                            }}
                            placeholder="Description"
                            aria-invalid={!!errors.description}
                        />

                        {errors.description && (
                            <FieldError>{errors.description}</FieldError>
                        )}
                    </Field>
                    {/* price */}
                    <Field>
                        <FieldLabel htmlFor="age">Price</FieldLabel>

                        <Input
                            id="price"
                            name="price"
                            type="text"
                            min="0"
                            value={data.price}
                            onChange={(e) => {
                                setData('price', e.target.value);
                                clearErrors('price');
                            }}
                            placeholder="50$"
                            aria-invalid={!!errors.price}
                        />

                        <FieldDescription>
                            What is the price for this service?
                        </FieldDescription>

                        {errors.price && (
                            <FieldError>{errors.price}</FieldError>
                        )}
                    </Field>

                    {/* duration */}
                    <Field>
                        <FieldLabel htmlFor="duration">Duration</FieldLabel>

                        <Input
                            id="duration"
                            name="duration"
                            value={data.duration}
                            onChange={(e) => {
                                setData('duration', e.target.value);
                                clearErrors('duration');
                            }}
                            placeholder="Duration"
                            aria-invalid={!!errors.duration}
                        />

                        {errors.duration && (
                            <FieldError>{errors.duration}</FieldError>
                        )}
                    </Field>
                    {/* status */}
                    <Field>
                        <div className="flex items-center justify-start gap-4">
                            <FieldLabel htmlFor="status">Status</FieldLabel>

                            <Switch
                                id="status"
                                name="status"
                                checked={data.status === 'available'}
                                onCheckedChange={(checked) => {
                                    setData(
                                        'status',
                                        checked ? 'available' : 'unavailable',
                                    );
                                    clearErrors('status');
                                }}
                                aria-invalid={!!errors.status}
                            />
                        </div>

                        {errors.status && (
                            <FieldError>{errors.status}</FieldError>
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
                            setData('description', '');
                            setData('price', '');
                            setData('duration', '');
                            setData('status', '');
                        }}
                    >
                        Reset
                    </Button>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? treatment
                                ? 'Updating'
                                : 'Creating...'
                            : treatment
                              ? 'Update Treatment'
                              : 'Create Treatment'}
                    </Button>
                </div>
            </CardFooter>
        </form>
    );
}
