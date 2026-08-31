import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';

import { CardContent, CardFooter } from '@/components/ui/card';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Appointment, Dentist, Patient } from '@/types/app/types';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface AppointmentFormData {
    patient_id: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    reason: string;
    note: string;
    dentist_id: string;
}

interface AppointmentFormProps {
    data: AppointmentFormData;
    patients: Patient[];
    dentists: Dentist[];
    setData: (
        key: keyof AppointmentFormData,
        value: AppointmentFormData[keyof AppointmentFormData],
    ) => void;
    errors: Partial<Record<keyof AppointmentFormData, string>>;
    clearErrors: (field: keyof AppointmentFormData) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    appointment?: Appointment;
}

export default function AppointmentForm({
    data,
    patients,
    dentists,
    setData,
    errors,
    clearErrors,
    onSubmit,
    processing,
    appointment,
}: AppointmentFormProps) {
    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <form onSubmit={onSubmit}>
            <CardContent>
                <FieldGroup>
                    {/* Patient */}
                    <Field>
                        <FieldLabel htmlFor="patient_id">Patient</FieldLabel>
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
                        <FieldLabel>Dentist</FieldLabel>

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

                    {/* Appointment Date */}
                    <Field>
                        <FieldLabel htmlFor="appointment_date">
                            Appointment Date
                        </FieldLabel>

                        <Input
                            id="appointment_date"
                            name="appointment_date"
                            type="date"
                            value={data.appointment_date}
                            onChange={(e) => {
                                setData('appointment_date', e.target.value);
                                clearErrors('appointment_date');
                            }}
                            aria-invalid={!!errors.appointment_date}
                        />

                        {errors.appointment_date && (
                            <FieldError>{errors.appointment_date}</FieldError>
                        )}
                    </Field>

                    {/* Appointment Time */}
                    <Field>
                        <FieldLabel htmlFor="appointment_time">
                            Appointment Time
                        </FieldLabel>

                        <Input
                            id="appointment_time"
                            name="appointment_time"
                            type="time"
                            value={data.appointment_time}
                            onChange={(e) => {
                                setData('appointment_time', e.target.value);
                                clearErrors('appointment_time');
                            }}
                            aria-invalid={!!errors.appointment_time}
                        />

                        {errors.appointment_time && (
                            <FieldError>{errors.appointment_time}</FieldError>
                        )}
                    </Field>

                    {/* Status */}
                    <Field>
                        <div className="flex items-center justify-start gap-4">
                            <FieldLabel htmlFor="status">Status</FieldLabel>

                            <Switch
                                id="status"
                                name="status"
                                checked={data.status === 'open'}
                                onCheckedChange={(checked) => {
                                    setData(
                                        'status',
                                        checked ? 'open' : 'closed',
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

                    {/* Reason */}
                    <Field>
                        <FieldLabel htmlFor="reason">Reason</FieldLabel>

                        <Input
                            id="reason"
                            name="reason"
                            value={data.reason}
                            onChange={(e) => {
                                setData('reason', e.target.value);
                                clearErrors('reason');
                            }}
                            placeholder="e.g. Tooth pain, checkup"
                            aria-invalid={!!errors.reason}
                        />

                        <FieldDescription>
                            Reason for the patient's appointment.
                        </FieldDescription>

                        {errors.reason && (
                            <FieldError>{errors.reason}</FieldError>
                        )}
                    </Field>

                    {/* Note */}
                    <Field>
                        <FieldLabel htmlFor="note">Note</FieldLabel>

                        <Textarea
                            id="note"
                            name="note"
                            value={data.note}
                            onChange={(e) => {
                                setData('note', e.target.value);
                                clearErrors('note');
                            }}
                            placeholder="Note"
                            aria-invalid={!!errors.note}
                        />

                        {errors.note && <FieldError>{errors.note}</FieldError>}
                    </Field>
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
                            setData('appointment_date', '');
                            setData('appointment_time', '');
                            setData('status', 'open');
                            setData('reason', '');
                            setData('note', '');
                        }}
                    >
                        Reset
                    </Button>

                    <Button type="submit" disabled={processing}>
                        {processing
                            ? appointment
                                ? 'Updating...'
                                : 'Creating...'
                            : appointment
                              ? 'Update Appointment'
                              : 'Create Appointment'}
                    </Button>
                </div>
            </CardFooter>
        </form>
    );
}
