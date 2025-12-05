<?php

namespace Database\Seeders;

use App\Models\Member;
use App\Models\Payments;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'member-owner@example.com'],
            [
                'name' => 'Osnovni korisnik',
                'workos_id' => 'seed-'.Str::uuid(),
                'avatar' => '',
                'role' => 'admin',
            ]
        );

        $dataPath = database_path('seeders/data/members_with_payments.json');
        if (!file_exists($dataPath)) {
            $this->command?->warn('Members data file not found: '.$dataPath);
            return;
        }

        $records = json_decode(file_get_contents($dataPath), true) ?? [];
        $years = ['2019', '2020', '2021', '2022', '2023', '2024'];

        

        foreach ($records as $record) {
            $member = Member::create([
                'first_name' => trim($record['first_name'] ?? ''),
                'last_name' => trim($record['last_name'] ?? ''),
                'user_id' => $user->id,
            ]);

            foreach ($years as $year) {
                $amount = $record[$year] ?? null;
                if ($amount === null || (float) $amount === 0.0) {
                    continue;
                }

                $startDate = sprintf('%s-12-30T23:00:00.000Z', $year);
                $endDate = sprintf('%s-12-30T23:00:00.000Z', (int) $year + 1);

                Payments::create([
                    'member_id' => $member->id,
                    'amount' => $amount,
                    'type_of_payment' => 'Članarina',
                    'date_of_payment' => $startDate,
                    'paid_from' => $startDate,
                    'paid_to' => $endDate,
                    'note' => 'Članarina za godinu '.$year,
                ]);
            }
        }
    }
}
