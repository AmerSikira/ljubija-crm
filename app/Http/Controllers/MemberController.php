<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MemberController extends Controller
{
    //

    public function index() {

        $members = Member::all();
        return Inertia::render('members/index', ['members' => $members]);
    }

    public function create() {
        
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
}
