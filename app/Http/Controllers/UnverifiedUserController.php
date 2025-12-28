<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnverifiedUserController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user?->role === 'admin';

        $users = [];
        if ($isAdmin) {
            $users = User::query()
                ->whereDoesntHave('member')
                ->where('role', '!=', 'admin')
                ->orderByDesc('created_at')
                ->get(['id', 'name', 'email', 'role', 'created_at']);
        }

        return Inertia::render('unverified/index', [
            'users' => $users,
            'isAdmin' => $isAdmin,
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }

        if ($user->role === 'admin') {
            return back()->with('error', 'Administrator se ne može obrisati.');
        }

        if ($user->member) {
            return back()->with('error', 'Korisnik već ima dodijeljenog člana.');
        }

        $user->delete();

        return back()->with('success', 'Korisnik je obrisan.');
    }
}
