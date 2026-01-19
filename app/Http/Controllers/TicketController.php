<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $tickets = Ticket::where('user_id', $user->id)
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = $request->string('search');
                $query->where('subject', 'like', '%' . $term . '%');
            })
            ->orderByDesc('last_activity_at')
            ->get();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets->map(fn (Ticket $ticket) => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'admin_unread' => $ticket->admin_unread,
                'user_unread' => $ticket->user_unread,
                'last_activity_at' => $ticket->last_activity_at,
                'created_at' => $ticket->created_at,
            ]),
            'filters' => [
                'search' => $request->input('search'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('tickets/create');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'subject' => 'required|string|max:150',
            'message' => 'required|string|min:5',
        ], [
            'subject.required' => 'Naslov je obavezan.',
            'subject.max' => 'Naslov može imati najviše 150 znakova.',
            'message.required' => 'Poruka je obavezna.',
            'message.min' => 'Poruka mora imati najmanje 5 znakova.',
        ]);

        $ticket = Ticket::create([
            'user_id' => $user->id,
            'subject' => $data['subject'],
            'status' => Ticket::STATUS_UPIT,
            'admin_unread' => true,
            'user_unread' => false,
            'last_activity_at' => now(),
        ]);

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'author_type' => 'user',
            'author_id' => $user->id,
            'message' => $data['message'],
        ]);

        return redirect()->route('tickets.show', ['ticket' => $ticket->id])
            ->with('success', 'Vaša poruka je kreirana.');
    }

    public function show(Request $request, Ticket $ticket)
    {
        $this->authorize('view', $ticket);

        if ($ticket->user_unread) {
            $ticket->markReadByUser();
        }

        $ticket->load([
            'messages' => fn ($query) => $query->with('author:id,name,email')->orderBy('created_at'),
        ]);

        $messages = $ticket->messages->map(function (TicketMessage $message) {
            return [
                'id' => $message->id,
                'author_type' => $message->author_type,
                'author_id' => $message->author_id,
                'author_name' => $message->author?->name ?? $message->author?->email ?? 'Korisnik',
                'message' => $message->message,
                'created_at' => $message->created_at,
            ];
        });

        return Inertia::render('tickets/show', [
            'ticket' => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'admin_unread' => $ticket->admin_unread,
                'user_unread' => $ticket->user_unread,
                'last_activity_at' => $ticket->last_activity_at,
                'created_at' => $ticket->created_at,
            ],
            'messages' => $messages,
        ]);
    }

    public function storeMessage(Request $request, Ticket $ticket)
    {
        $this->authorize('update', $ticket);

        $user = $request->user();

        $data = $request->validate([
            'message' => 'required|string|min:5',
        ], [
            'message.required' => 'Poruka je obavezna.',
            'message.min' => 'Poruka mora imati najmanje 5 znakova.',
        ]);

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'author_type' => 'user',
            'author_id' => $user->id,
            'message' => $data['message'],
        ]);

        $ticket->forceFill([
            'admin_unread' => true,
            'user_unread' => false,
            'status' => Ticket::STATUS_UPIT,
            'last_activity_at' => now(),
        ])->save();

        return redirect()->route('tickets.show', ['ticket' => $ticket->id])
            ->with('success', 'Poruka je poslana.');
    }

    public function destroy(Request $request, Ticket $ticket)
    {
        $this->authorize('delete', $ticket);

        $ticket->delete();

        return redirect()->route('tickets.index')
            ->with('success', 'Poruka je obrisana.');
    }
}
