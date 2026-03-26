<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate([
            'username' => 'admin',
        ], [
            'name' => 'System Admin',
            'password' => 'admin123',
            'role' => 'admin',
        ]);

        User::query()->updateOrCreate([
            'username' => 'user',
        ], [
            'name' => 'Demo User',
            'password' => 'user123',
            'role' => 'user',
        ]);
    }
}
