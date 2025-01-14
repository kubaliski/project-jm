<?php

namespace App\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;

class Authenticate
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()) {
            throw new AuthenticationException();
        }

        return $next($request);
    }
}