import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Patient, Dentist, TreatmentCase } from '@/types/app/types';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface TreatmentCaseFormData {
    patient_id: string;
    dentist_id: string;
    diagnosis: string;
    notes: string;
    status: string;
}

interface TreatmentCaseFormProps {
    data: TreatmentCaseFormData;
    setData: (
        key: keyof TreatmentCaseFormData,
        value: TreatmentCaseFormData[keyof TreatmentCaseFormData],
    ) => void;
    errors: Partial<Record<keyof TreatmentCaseFormData, string>>;
    clearErrors: (field: keyof TreatmentCaseFormData) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing: boolean;

    patients: Pick<Patient, 'id' | 'name' | 'patient_id'>[];
    dentists: Pick<Dentist, 'id' | 'name'>[];

    treatmentCase?: TreatmentCase;
}

export default function TreatmentCaseForm({
    data,
    setData,
    errors,
    clearErrors,
    processing,
    onSubmit,
    patients,
    dentists,
    treatmentCase,
}: TreatmentCaseFormProps) {
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <form onSubmit={onSubmit}>
            <CardContent>
                <FieldGroup>
                    {/* Patient */}
                    <Field>
                        <FieldLabel htmlFor="patient_id">
                            Patient <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                >
                                    {data.patient_id
                                        ? patients.find(
                                              (p) =>
                                                  String(p.id) ===
                                                  data.patient_id,
                                          )?.name
                                        : 'Select patient'}

                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search patient..." />

                                    <CommandEmpty>
                                        No patient found.
                                    </CommandEmpty>

                                    <CommandGroup>
                                        {patients.map((patient) => (
                                            <CommandItem
                                                key={patient.id}
                                                value={`${patient.name} ${patient.patient_id}`}
                                                onSelect={() => {
                                                    setData(
                                                        'patient_id',
                                                        String(patient.id),
                                                    );
                                                    clearErrors('patient_id');
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={`mr-2 h-4 w-4 ${
                                                        data.patient_id ===
                                                        String(patient.id)
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    }`}
                                                />

                                                <div>
                                                    <div>{patient.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {patient.patient_id}
                                                    </div>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {errors.patient_id && (
                            <FieldError>{errors.patient_id}</FieldError>
                        )}
                    </Field>

                    {/* Dentist */}
                    <Field>
                        <FieldLabel>
                            Dentist <span className="text-red-500">*</span>
                        </FieldLabel>

                        <Popover open={isOpen} onOpenChange={setIsOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                >
                                    {data.dentist_id
                                        ? dentists.find(
                                              (dentist) =>
                                                  String(dentist.id) ===
                                                  data.dentist_id,
                                          )?.name
                                        : 'Select dentist'}

                                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search dentist..." />

                                    <CommandEmpty>
                                        No dentist found.
                                    </CommandEmpty>

                                    <CommandGroup>
                                        {dentists.map((dentist) => (
                                            <CommandItem
                                                key={dentist.id}
                                                value={dentist.name}
                                                onSelect={() => {
                                                    setData(
                                                        'dentist_id',
                                                        String(dentist.id),
                                                    );

                                                    clearErrors('dentist_id');
                                                    setIsOpen(false);
                                                }}
                                            >
                                                {dentist.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {errors.dentist_id && (
                            <FieldError>{errors.dentist_id}</FieldError>
                        )}
                    </Field>

                    {/* Diagnosis */}
                    <Field>
                        <FieldLabel htmlFor="diagnosis">Diagnosis</FieldLabel>

                        <Textarea
                            id="diagnosis"
                            value={data.diagnosis}
                            onChange={(e) => {
                                setData('diagnosis', e.target.value);
                                clearErrors('diagnosis');
                            }}
                            placeholder="Patient diagnosis"
                        />

                        <FieldDescription>
                            Initial diagnosis before treatment.
                        </FieldDescription>

                        {errors.diagnosis && (
                            <FieldError>{errors.diagnosis}</FieldError>
                        )}
                    </Field>

                    {/* Notes */}
                    <Field>
                        <FieldLabel htmlFor="notes">Notes</FieldLabel>

                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => {
                                setData('notes', e.target.value);
                                clearErrors('notes');
                            }}
                            placeholder="Additional notes"
                        />

                        {errors.notes && (
                            <FieldError>{errors.notes}</FieldError>
                        )}
                    </Field>

                    {/* Status */}
                    <Field>
                        <div className="flex items-center justify-between">
                            <div>
                                <FieldLabel htmlFor="status">Status</FieldLabel>

                                <FieldDescription>
                                    Ongoing or completed treatment case.
                                </FieldDescription>
                            </div>

                            <Switch
                                id="status"
                                checked={data.status === 'completed'}
                                onCheckedChange={(checked) => {
                                    setData(
                                        'status',
                                        checked ? 'completed' : 'ongoing',
                                    );
                                    clearErrors('status');
                                }}
                            />
                        </div>

                        {errors.status && (
                            <FieldError>{errors.status}</FieldError>
                        )}
                    </Field>

                    {/* Read-only financial summary on Edit */}
                    {treatmentCase && (
                        <Field>
                            <FieldLabel>Financial Summary</FieldLabel>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Total
                                    </p>
                                    <p className="font-semibold">
                                        $
                                        {Number(
                                            treatmentCase.total_amount,
                                        ).toFixed(2)}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Paid
                                    </p>
                                    <p className="font-semibold">
                                        $
                                        {Number(
                                            treatmentCase.paid_amount,
                                        ).toFixed(2)}
                                    </p>
                                </div>

                                <div className="rounded-lg border p-3">
                                    <p className="text-xs text-muted-foreground">
                                        Balance
                                    </p>
                                    <p className="font-semibold">
                                        $
                                        {Number(
                                            treatmentCase.balance_amount,
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </Field>
                    )}
                </FieldGroup>
            </CardContent>

            <CardFooter className="pt-4">
                <div className="flex w-full justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setData('patient_id', '');
                            setData('dentist_id', '');
                            setData('diagnosis', '');
                            setData('notes', '');
                            setData('status', 'ongoing');
                        }}
                    >
                        Reset
                    </Button>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? treatmentCase
                                ? 'Updating...'
                                : 'Creating...'
                            : treatmentCase
                              ? 'Update Treatment Case'
                              : 'Create Treatment Case'}
                    </Button>
                </div>
            </CardFooter>
        </form>
    );
}
