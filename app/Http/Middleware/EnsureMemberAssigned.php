<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blocks access for users bez dodijeljenog člana (osim admina),
 * usmjerava ih na stranicu za neverifikovane korisnike.
 */
class EnsureMemberAssigned
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (app()->runningUnitTests()) {
            return $next($request);
        }

        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        if ($user->role === 'admin') {
            return $next($request);
        }

        $isUnverified = !$user->member()->exists();

        if (!$isUnverified) {
            return $next($request);
        }

        if ($request->routeIs('unverified-users') || $request->routeIs('unverified-users.*') || $request->routeIs('logout')) {
            return $next($request);
        }

        return redirect()->route('unverified-users');
    }
}
