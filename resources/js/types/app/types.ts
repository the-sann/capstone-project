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
    age: number;
    gender: string;
    phone: string;
    address: string;
    created_at: string;
    updated_at: string;
};
