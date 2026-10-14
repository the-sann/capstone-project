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
    dentist_id: number;
    treatment_case_id?: number | null;
    treatment_case?: TreatmentCase | null;
    appointment_date: string;
    appointment_time: string;
    status: 'open' | 'closed';
    reason: string;
    note: string | null;
    patient: Patient;
    dentist: Pick<Dentist, 'id' | 'name'>;
};
export type TreatmentCaseItem = {
    id: number;
    treatment_case_id: number;
    treatment_service_id: number;
    tooth_number: string | null;
    quantity: number;
    unit_price: string;
    total_price: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    completed_at: string | null;
    notes: string | null;
    treatment_service: Treatment;
};

export type TreatmentCase = {
    id: number;
    case_id: string;
    patient_id: number;
    dentist_id: number;
    diagnosis: string | null;
    notes: string | null;
    status: 'ongoing' | 'completed' | 'cancelled';
    total_amount: string;
    paid_amount: string;
    balance_amount: string;
    created_at: string;
    updated_at: string;
    patient: Patient;
    dentist: Dentist;
    items?: TreatmentCaseItem[];
    appointments?: Appointment[];
};
