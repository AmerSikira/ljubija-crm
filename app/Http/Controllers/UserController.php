<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    private array $roleLabels = [
        'admin' => 'Admin',
        'manager' => 'Menadžer',
        'subscriber' => 'Korisnik',
    ];

    private function ensureAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }

    public function index(Request $request)
    {
        $this->ensureAdmin($request);

        $users = User::query()
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'avatar', 'created_at']);

        return Inertia::render('users/index', [
            'users' => $users,
            'roleLabels' => $this->roleLabels,
        ]);
    }

    public function edit(Request $request, User $user)
    {
        $this->ensureAdmin($request);

        return Inertia::render('users/edit', [
            'user' => $user->only(['id', 'name', 'email', 'role', 'avatar', 'created_at']),
            'roleLabels' => $this->roleLabels,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $this->ensureAdmin($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', Rule::in(array_keys($this->roleLabels))],
            'avatar' => ['nullable', 'string'],
        ]);

        $user->fill($validated);
        $user->save();

        return redirect()->route('users.edit', ['user' => $user->id])->with('success', 'Korisnik je ažuriran.');
    }
}
