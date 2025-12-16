<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    //

    protected function authorizeAdmin(Request $request)
    {
        $role = $request->user()?->role;
        if ($role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    public function index(Request $request) {
        $this->authorizeAdmin($request);
        $search = trim((string) $request->input('search', ''));

        $members = Member::query()
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->orderBy('id')
            ->paginate(20)
            ->appends(['search' => $search]);

        return Inertia::render('members/index', [
            'members' => $members,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create() {
        // Only admins
        $this->authorizeAdmin(request());
        
        $users = User::select('id', 'name', 'email')->get();
        // dd($users);
        return Inertia::render('members/create', ['users' => $users]);
    }

    public function store(Request $request) {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ], [
            'user_id.required' => 'Morate odabrati korisnika',
            'user_id.exists' => 'Odabrani korisnik ne postoji',
            'first_name.max' => 'Ime ne može biti duže od 255 znakova',
            'last_name.max' => 'Prezime ne može biti duže od 255 znakova',
            'email.email' => 'Email nije ispravan',
            'email.max' => 'Email ne može biti duži od 255 znakova',
            'phone.max' => 'Broj telefona ne može biti duži od 20 znakova',
            'address.max' => 'Adresa ne može biti duža od 500 znakova',
        ]);

        // dd($request->all());
        $member = new Member();
        $member->first_name = $request->first_name;
        $member->last_name = $request->last_name;
        $member->email = $request->email;
        $member->phone = $request->phone;
        $member->address = $request->address;
        $member->birthdate = $request->birthdate;
        $member->family_members = json_encode($request->family_members);
        $member->email_abroad = $request->email_abroad;
        $member->phone_abroad = $request->phone_abroad;
        $member->address_abroad = $request->address_abroad;
        $member->city_abroad = $request->city_abroad;
        $member->country = $request->country;
        $member->user()->associate($request->user_id);
        $member->save();
        
       
       

        return redirect()->route('members')->with('success', 'Član je uspješno kreiran.');
    }


    public function edit(Request $request, $member) {
        $this->authorizeAdmin($request);
        $users = User::select('id', 'name', 'email')->get();
        $member = Member::find($member);
        if (!$member) {
            return redirect()->route('members')->with('error', 'Član nije pronađen.');
        }
        $member->family_members = json_decode($member->family_members, true) ?? [];
        // dd($member->user);
        return Inertia::render("members/edit", ['member' => $member, 'users' => $users]);
    }


    public function update(Request $request, $member) {
        $this->authorizeAdmin($request);
        $member = Member::find($member);
        if (!$member) {
            return redirect()->route('members')->with('error', 'Član nije pronađen.');
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ], [
            'user_id.required' => 'Morate odabrati korisnika',
            'user_id.exists' => 'Odabrani korisnik ne postoji',
            'first_name.max' => 'Ime ne može biti duže od 255 znakova',
            'last_name.max' => 'Prezime ne može biti duže od 255 znakova',
            'email.email' => 'Email nije ispravan',
            'email.max' => 'Email ne može biti duži od 255 znakova',
            'phone.max' => 'Broj telefona ne može biti duži od 20 znakova',
            'address.max' => 'Adresa ne može biti duža od 500 znakova',
        ]);

        $member->first_name = $request->first_name;
        $member->last_name = $request->last_name;
        $member->email = $request->email;
        $member->phone = $request->phone;
        $member->address = $request->address;
        $member->birthdate = $request->birthdate;
        $member->family_members = json_encode($request->family_members);
        $member->email_abroad = $request->email_abroad;
        $member->phone_abroad = $request->phone_abroad;
        $member->address_abroad = $request->address_abroad;
        $member->city_abroad = $request->city_abroad;
        $member->country = $request->country;
        $member->user()->associate($request->user_id);
        $member->save();

        return redirect()->route('members')->with('success', 'Član je uspješno ažuriran.');
    }

    public function editSelf(Request $request)
    {
        $member = Member::where('user_id', $request->user()->id)->first();

        if (!$member) {
            return redirect()->route('dashboard')->with('error', 'Nemate pridruženog člana za uređivanje.');
        }

        $member->family_members = json_decode($member->family_members, true) ?? [];

        return Inertia::render('members/my-profile', ['member' => $member]);
    }

    public function updateSelf(Request $request)
    {
        $member = Member::where('user_id', $request->user()->id)->first();

        if (!$member) {
            return redirect()->route('dashboard')->with('error', 'Nemate pridruženog člana za uređivanje.');
        }

        $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ], [
            'first_name.max' => 'Ime ne može biti duže od 255 znakova',
            'last_name.max' => 'Prezime ne može biti duže od 255 znakova',
            'email.email' => 'Email nije ispravan',
            'email.max' => 'Email ne može biti duži od 255 znakova',
            'phone.max' => 'Broj telefona ne može biti duži od 20 znakova',
            'address.max' => 'Adresa ne može biti duža od 500 znakova',
        ]);

        $member->first_name = $request->first_name;
        $member->last_name = $request->last_name;
        $member->email = $request->email;
        $member->phone = $request->phone;
        $member->address = $request->address;
        $member->birthdate = $request->birthdate;
        $member->family_members = json_encode($request->family_members);
        $member->email_abroad = $request->email_abroad;
        $member->phone_abroad = $request->phone_abroad;
        $member->address_abroad = $request->address_abroad;
        $member->city_abroad = $request->city_abroad;
        $member->country = $request->country;
        $member->save();

        return redirect()->route('members.self')->with('success', 'Podaci su uspješno ažurirani.');
    }
}
