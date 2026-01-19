<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $tickets = Ticket::with('user:id,name,email')
            ->when($request->filled('search'), function ($query) use ($request) {
                $term = $request->string('search');
                $query->where('subject', 'like', '%' . $term . '%');
            })
            ->orderByDesc('admin_unread')
            ->orderByDesc('last_activity_at')
            ->get();

        return Inertia::render('admin/tickets/index', [
            'tickets' => $tickets->map(fn (Ticket $ticket) => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'admin_unread' => $ticket->admin_unread,
                'user_unread' => $ticket->user_unread,
                'last_activity_at' => $ticket->last_activity_at,
                'created_at' => $ticket->created_at,
                'user' => [
                    'id' => $ticket->user->id,
                    'name' => $ticket->user->name ?? $ticket->user->email ?? 'Korisnik',
                ],
            ]),
            'filters' => [
                'search' => $request->input('search'),
            ],
        ]);
    }

    public function show(Request $request, Ticket $ticket)
    {
        $this->authorizeAdmin($request);

        if ($ticket->admin_unread) {
            $ticket->markReadByAdmin();
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

        return Inertia::render('admin/tickets/show', [
            'ticket' => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
                'admin_unread' => $ticket->admin_unread,
                'user_unread' => $ticket->user_unread,
                'last_activity_at' => $ticket->last_activity_at,
                'created_at' => $ticket->created_at,
                'user' => [
                    'id' => $ticket->user->id,
                    'name' => $ticket->user->name ?? $ticket->user->email ?? 'Korisnik',
                ],
            ],
            'messages' => $messages,
        ]);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $this->authorizeAdmin($request);

        $admin = $request->user();

        $data = $request->validate([
            'message' => 'required|string|min:5',
        ], [
            'message.required' => 'Poruka je obavezna.',
            'message.min' => 'Poruka mora imati najmanje 5 znakova.',
        ]);

        TicketMessage::create([
            'ticket_id' => $ticket->id,
            'author_type' => 'admin',
            'author_id' => $admin->id,
            'message' => $data['message'],
        ]);

        $ticket->forceFill([
            'status' => Ticket::STATUS_ODGOVORENO,
            'admin_unread' => false,
            'user_unread' => true,
            'last_activity_at' => now(),
        ])->save();

        return redirect()->route('admin.tickets.show', ['ticket' => $ticket->id])
            ->with('success', 'Odgovor je poslan.');
    }

    public function destroy(Request $request, Ticket $ticket)
    {
        $this->authorizeAdmin($request);

        $ticket->delete();

        return redirect()->route('admin.tickets.index')
            ->with('success', 'Poruka je obrisana.');
    }

    private function authorizeAdmin(Request $request): void
    {
        if ($request->user()?->role !== 'admin') {
            abort(403, 'Nedovoljno privilegija.');
        }
    }
}
