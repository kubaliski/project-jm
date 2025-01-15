<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Mail\NewContactMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PublicContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        Mail::to('angel.ccapb@gmail.com')->send(new NewContactMail($contact));

        return response()->json([
            'message' => 'Mensaje enviado correctamente',
            'contact' => [
                'id' => $contact->id,
                'full_name' => $contact->full_name,
                'subject' => $contact->subject,
                'created_at' => $contact->created_at
            ]
        ], 201);
    }
}