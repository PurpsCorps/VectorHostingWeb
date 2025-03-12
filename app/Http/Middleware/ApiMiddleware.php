<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-Requested');

        if ($apiKey !== env('VITE_API_KEY')) {
            return response()->json(['error' => 'API key tidak valid'], 401);
        }

        return $next($request);
    }
}