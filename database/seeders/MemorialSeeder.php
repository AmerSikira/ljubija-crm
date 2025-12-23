<?php

namespace Database\Seeders;

use App\Models\Memorial;
use Illuminate\Database\Seeder;

class MemorialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $people = [
            ['Alagić', 'Džemal'],
            ['Alisić', 'Zijad'],
            ['Alisić', 'Sabahudin'],
            ['Alisić', 'Midho'],
            ['Bahtić', 'Ismet'],
            ['Bajrić', 'Nerzuk'],
            ['Bajrić', 'Ibrahim'],
            ['Basić', '(V) Bahrika'],
            ['Bašić', '(I) Nermin'],
            ['Bašić', 'Ako'],
            ['Bašić', 'Zijad'],
            ['Bešić', 'Rudo'],
            ['Bešić', 'Fahro'],
            ['Biščević', 'Muharem'],
            ['Biščević', 'Nino'],
            ['Brandić', 'Velid'],
            ['Brdar', 'Mirzet'],
            ['Ćehić', 'Zikrija'],
            ['Ćehić', 'Indir'],
            ['Ćurak', 'Seada'],
            ['Demirović', 'Muharem'],
            ['Demirović', 'Ismet'],
            ['Demirović', 'Braco'],
            ['Denić', 'Nihad'],
            ['Dimać', 'Milutin'],
            ['Draganović', 'Dževad'],
            ['Draganović', 'Hamdo'],
            ['Draganović', 'Senad'],
            ['Džafić', 'Nermin'],
            ['Džafić', 'Nusret'],
            ['Džafić', 'Redžo'],
            ['Halilović', 'Suad'],
            ['Halilović', 'Nedžad'],
            ['Henić', 'Admir'],
            ['Henić', 'Braco'],
            ['Hodzic', 'Fudo'],
            ['Hodžić', 'Mustafa'],
            ['Hodžić', 'Kemal'],
            ['Hodžić', 'Fadil'],
            ['Ikanović', 'Hasib'],
            ['Ikanović', 'Smail'],
            ['Ikanović', 'Mustafa'],
            ['Islamović', 'Mirzad'],
            ['Islamović', 'Mensur'],
            ['Islamović', 'Edin'],
            ['Islamović', 'Sakib'],
            ['Islamović', 'Huse'],
            ['Islamović', 'Ismet'],
            ['Islamović', 'Mehmed'],
            ['Islamović', 'Mirsad'],
            ['Islamović', 'Enver'],
            ['Kadridad', 'Hasan'],
            ['Kolonić', 'Saud'],
            ['Komarević', 'Ajaz'],
            ['Maćić', 'Kasim'],
            ['Murtić', 'Ismet'],
            ['Sahurić', 'Braco'],
            ['Sahurić', 'Džanan'],
            ['Šahurić', 'Dursum'],
            ['Sarajlić', 'Fikreta'],
            ['Seferović', 'Safet'],
            ['Softić', 'Suljo'],
            ['Suhonjić', 'Jasim'],
            ['Šumić', 'Razim'],
            ['Šumić', 'Safet'],
            ['Vejzović', 'Almir'],
            ['Vejzović', 'Nihad'],
            ['Zahirović', '(S) Sead'],
            ['Zenković', 'Uzeir'],
            ['Zenković', 'Irfan'],
        ];

        foreach ($people as [$lastName, $firstName]) {
            Memorial::updateOrCreate(
                [
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                ],
                [
                    'status' => 'nema_statusa',
                    'birth_date' => '1970-01-01',
                    'birth_place' => 'Ljubija',
                    'status_place' => 'Ljubija',
                    'published' => true,
                    'short_info' => null,
                ]
            );
        }
    }
}
