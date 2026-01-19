<?php

use App\Models\Ticket;
use App\Models\TicketMessage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;

uses(RefreshDatabase::class);

it('allows a user to create a ticket with first message', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('tickets.store'), [
        'subject' => 'Test tiket',
        'message' => 'Ovo je test poruka.',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('tickets', [
        'subject' => 'Test tiket',
        'user_id' => $user->id,
        'status' => Ticket::STATUS_UPIT,
        'admin_unread' => true,
    ]);

    $ticket = Ticket::where('subject', 'Test tiket')->first();
    $this->assertDatabaseHas('ticket_messages', [
        'ticket_id' => $ticket->id,
        'author_type' => 'user',
        'author_id' => $user->id,
    ]);
});

it('prevents a user from viewing another users ticket', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $ticket = Ticket::create([
        'user_id' => $owner->id,
        'subject' => 'Vlasnikov tiket',
        'status' => Ticket::STATUS_UPIT,
        'admin_unread' => true,
        'user_unread' => false,
        'last_activity_at' => now(),
    ]);

    $this->actingAs($other)->get(route('tickets.show', $ticket))->assertForbidden();
});

it('shows unread tickets first to admin', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $oldTicket = Ticket::create([
        'user_id' => $admin->id,
        'subject' => 'Stariji',
        'status' => Ticket::STATUS_UPIT,
        'admin_unread' => false,
        'user_unread' => false,
        'last_activity_at' => now()->subDay(),
    ]);

    $newUnread = Ticket::create([
        'user_id' => $admin->id,
        'subject' => 'Novi nepročitan',
        'status' => Ticket::STATUS_UPIT,
        'admin_unread' => true,
        'user_unread' => false,
        'last_activity_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.tickets.index'))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/tickets/index')
            ->where('tickets.0.id', $newUnread->id)
            ->where('tickets.1.id', $oldTicket->id)
        );
});

it('marks admin reply as odgovoreno and updates unread flags', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create();

    $ticket = Ticket::create([
        'user_id' => $user->id,
        'subject' => 'Za admina',
        'status' => Ticket::STATUS_UPIT,
        'admin_unread' => true,
        'user_unread' => false,
        'last_activity_at' => now()->subHour(),
    ]);

    $response = $this->actingAs($admin)->post(route('admin.tickets.reply', $ticket), [
        'message' => 'Admin odgovor.',
    ]);

    $response->assertRedirect();
    $ticket->refresh();

    expect($ticket->status)->toBe(Ticket::STATUS_ODGOVORENO);
    expect($ticket->admin_unread)->toBeFalse();
    expect($ticket->user_unread)->toBeTrue();

    $this->assertDatabaseHas('ticket_messages', [
        'ticket_id' => $ticket->id,
        'author_type' => 'admin',
        'author_id' => $admin->id,
    ]);
});

it('clears user unread flag when viewing ticket', function () {
    $user = User::factory()->create();

    $ticket = Ticket::create([
        'user_id' => $user->id,
        'subject' => 'Pregled',
        'status' => Ticket::STATUS_ODGOVORENO,
        'admin_unread' => false,
        'user_unread' => true,
        'last_activity_at' => now(),
    ]);

    TicketMessage::create([
        'ticket_id' => $ticket->id,
        'author_type' => 'admin',
        'author_id' => $user->id,
        'message' => 'Odgovor za korisnika',
    ]);

    $this->actingAs($user)->get(route('tickets.show', $ticket))->assertOk();
    $ticket->refresh();

    expect($ticket->user_unread)->toBeFalse();
});
