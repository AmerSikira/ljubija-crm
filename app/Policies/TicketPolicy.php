<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function view(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin' || $ticket->user_id === $user->id;
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin' || $ticket->user_id === $user->id;
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin' || $ticket->user_id === $user->id;
    }

    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }
}
