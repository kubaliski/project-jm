<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Mail\NewContactMail;
use App\Services\IpBlacklistService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicContactController extends Controller
{
    private readonly IpBlacklistService $blacklistService;

    public function __construct(IpBlacklistService $blacklistService)
    {
        $this->blacklistService = $blacklistService;
    }

    public function store(Request $request): JsonResponse
    {
        // Check if IP is blacklisted
        if ($this->blacklistService->isBlacklisted($request->ip())) {
            Log::warning('Contact form submission attempt from blacklisted IP', [
                'ip' => $request->ip(),
                'email' => $request->input('email')
            ]);

            return response()->json([
                'message' => 'Tu acceso está temporalmente restringido debido a actividad sospechosa.'
            ], 403);
        }

        // Validate request
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            // Create contact
            $contact = Contact::create($validated);

            // Send email
            Mail::to('angel.ccapb@gmail.com')->send(new NewContactMail($contact));

            // Reset any previous attempts on successful submission
            $this->blacklistService->resetAttempts($request->ip(), 'contact_form');

            Log::info('New contact form submission', [
                'contact_id' => $contact->id,
                'email' => $contact->email
            ]);

            return response()->json([
                'message' => 'Mensaje enviado correctamente',
                'contact' => [
                    'id' => $contact->id,
                    'full_name' => $contact->full_name,
                    'subject' => $contact->subject,
                    'created_at' => $contact->created_at
                ]
            ], 201);

        } catch (\Exception $e) {
            // Record failed attempt
            $isBlocked = $this->blacklistService->recordAttempt($request->ip(), 'contact_form');

            Log::error('Error in contact form submission', [
                'ip' => $request->ip(),
                'email' => $request->input('email'),
                'error' => $e->getMessage(),
                'is_blocked' => $isBlocked
            ]);

            if ($isBlocked) {
                return response()->json([
                    'message' => 'Tu acceso ha sido temporalmente restringido debido a múltiples intentos fallidos.'
                ], 403);
            }

            return response()->json([
                'message' => 'Error al procesar tu mensaje. Por favor, inténtalo más tarde.'
            ], 500);
        }
    }
}