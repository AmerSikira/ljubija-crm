<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Payments;
use App\Models\User;
use App\Models\Member;

class PaymentsController extends Controller
{
    //

    public function index() {
        $payments = Payments::with('member')->get();
        return Inertia::render('payments/index', ['payments' => $payments]);
    }

    public function create(Request $request, $memberId = null) {
        $members = Member::select('id', 'first_name', 'last_name')->get();
        // dd($members);
        if ($members->isEmpty()) {
        
            return redirect()->route('members.create')->with('error', 'Morate prvo dodati člana prije nego što možete dodati uplatu.');
        }
        // dd($users);
        return Inertia::render('payments/create', ['members' => $members, 'memberId' => $memberId]);
    }

    public function store(Request $request) {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric|min:0',
            'type_of_payment' => 'required|string|max:255',
            'date_of_payment' => 'required|date',
            'note' => 'nullable|string|max:1000',
        ], [
            'member_id.required' => 'Morate odabrati člana',
            'member_id.exists' => 'Odabrani član ne postoji',
            'amount.required' => 'Iznos je obavezan',
            'amount.numeric' => 'Iznos mora biti broj',
            'amount.min' => 'Iznos ne može biti negativan broj',
            'type_of_payment.required' => 'Vrsta uplate je obavezna',
            'type_of_payment.max' => 'Vrsta uplate ne može biti duža od 255 znakova',
            'date_of_payment.required' => 'Datum uplate je obavezan',
            'date_of_payment.date' => 'Datum uplate nije ispravan',
            'note.max' => 'Napomena ne može biti duža od 1000 znakova',
        ]);

        $payment = new Payments();
        $payment->member_id = $request->member_id;
        $payment->amount = $request->amount;
        $payment->type_of_payment = $request->type_of_payment;
        $payment->date_of_payment = $request->date_of_payment;
        $payment->note = $request->note;
        $payment->save();

        return redirect()->route('payments')->with('success', 'Uplata je uspješno dodana.');
        //

     
    }

    public function edit(Request $request, $id) {
        $payment = Payments::findOrFail($id);
        $members = Member::select('id', 'first_name', 'last_name')->get();
        return Inertia::render('payments/edit', ['payment' => $payment, 'members' => $members]);

    }

    public function update(Request $request, $id) {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'amount' => 'required|numeric|min:0',
            'type_of_payment' => 'required|string|max:255',
            'date_of_payment' => 'required|date',
            'note' => 'nullable|string|max:1000',
        ], [
            'member_id.required' => 'Morate odabrati člana',
            'member_id.exists' => 'Odabrani član ne postoji',
            'amount.required' => 'Iznos je obavezan',
            'amount.numeric' => 'Iznos mora biti broj',
            'amount.min' => 'Iznos ne može biti negativan broj',
            'type_of_payment.required' => 'Vrsta uplate je obavezna',
            'type_of_payment.max' => 'Vrsta uplate ne može biti duža od 255 znakova',
            'date_of_payment.required' => 'Datum uplate je obavezan',
            'date_of_payment.date' => 'Datum uplate nije ispravan',
            'note.max' => 'Napomena ne može biti duža od 1000 znakova',
        ]);

        $payment = Payments::findOrFail($id);
        $payment->member_id = $request->member_id;
        $payment->amount = $request->amount;
        $payment->type_of_payment = $request->type_of_payment;
        $payment->date_of_payment = $request->date_of_payment;
        $payment->note = $request->note;
        $payment->save();

        return redirect()->route('payments')->with('success', 'Uplata je uspješno ažurirana.');

    }
}
