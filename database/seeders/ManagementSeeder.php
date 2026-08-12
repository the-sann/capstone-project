<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ManagementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@clinic.test',
            'password' => 'admin123',
            'user_type' => 'admin',
            'is_dentist' => false,
            'status' => true,
        ]);

        User::create([
            'name' => 'Dr. Lim Daro',
            'email' => 'doctor@clinic.test',
            'password' => 'doctor123',
            'user_type' => 'doctor',
            'is_dentist' => true,
            'status' => true,
        ]);

        User::create([
            'name' => 'Cashier',
            'email' => 'cashier@clinic.test',
            'password' => 'cashier123',
            'user_type' => 'cashier',
            'is_dentist' => false,
            'status' => true,
        ]);
    }
}
