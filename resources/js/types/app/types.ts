export type Dentist = {
    id: number;
    name: string;
    year_experienced: string;
    skill: string;
    created_at: string;
    updated_at: string;
    status: boolean;
    is_dentist: boolean;
    image: string;
    image_path: string;
    user_type: string;
};
export type Patient = {
    id: number;
    patient_id: string;
    name: string;
    age: string;
    gender: string;
    phone: string;
    address: string;
    created_at: string;
    updated_at: string;
};
export type Treatment = {
    id: number;
    name: string;
    description: string | null;
    price: string;
    duration: string;
    status: 'available' | 'unavailable';
};
export type Appointment = {
    id: number;
    appointment_id: string;
    patient_id: number;
    appointment_date: string;
    appointment_time: string;
    status: 'open' | 'closed';
    reason: string;
    note: string | null;
};
