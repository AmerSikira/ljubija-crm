<?php

namespace App\Http\Middleware;

use App\Models\Member;
use App\Models\Payments;
use App\Models\Expense;
use App\Models\Article;
use App\Models\ContentItem;
use App\Models\MektebEntry;
use App\Models\Memorial;
use App\Models\Ticket;
use App\Models\Project;
use App\Models\Poll;
use App\Models\User;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $user = $request->user();
        $memberId = $user?->member?->id;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'memberCount' => Member::count(),
            'menuCounts' => [
                'articles' => Article::count(),
                'content_items' => ContentItem::count(),
                'mekteb' => MektebEntry::count(),
                'memorials' => Memorial::count(),
                'tickets' => $user ? Ticket::where('user_id', $user->id)->count() : 0,
                'projects' => Project::count(),
                'polls' => Poll::count(),
                'admin_tickets' => Ticket::count(),
                'users' => User::count(),
                'members' => Member::count(),
                'unverified_users' => User::whereDoesntHave('member')->where('role', '!=', 'admin')->count(),
                'payments' => Payments::count(),
                'expenses' => Expense::count(),
                'my_payments' => $memberId ? Payments::where('member_id', $memberId)->count() : 0,
            ],
            'accountBalance' => $this->accountBalance(),
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'reservation_result' => $request->session()->get('reservation_result'),
            ],
        ];
    }

    private function accountBalance(): float
    {
        $base = 0.0;
        $balanceFile = storage_path('app/account_balance.json');
        if (file_exists($balanceFile)) {
            $raw = file_get_contents($balanceFile);
            $data = json_decode($raw, true);
            if (is_array($data) && isset($data['base'])) {
                $base = (float) $data['base'];
            }
        }

        $paymentsTotal = Payments::sum('amount'); // stored in cents
        $expensesTotal = Expense::sum('amount'); // stored in cents

        return $base + (($paymentsTotal - $expensesTotal) / 100);
    }
}
