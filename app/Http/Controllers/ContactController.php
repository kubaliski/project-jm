<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Contact::class, 'contact');
    }

    public function index(): JsonResponse
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        return response()->json($contacts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed,spam',
            'observations' => 'nullable|string'
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'message' => 'Contacto creado correctamente',
            'contact' => $contact
        ], 201);
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json($contact);
    }

    public function update(Request $request, Contact $contact): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'status' => 'required|in:pending,in_progress,completed,spam',
            'observations' => 'nullable|string'
        ]);

        $contact->update($validated);

        return response()->json([
            'message' => 'Contacto actualizado correctamente',
            'contact' => $contact
        ]);
    }

    public function updateStatus(Request $request, Contact $contact): JsonResponse
    {
        $this->authorize('updateStatus', $contact);

        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed,spam'
        ]);

        $contact->update($validated);

        return response()->json([
            'message' => 'Estado actualizado correctamente',
            'contact' => $contact
        ]);
    }

    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();

        return response()->json([
            'message' => 'Mensaje eliminado correctamente'
        ], 200);
    }

    public function count(): JsonResponse
    {
        $this->authorize('viewStats', Contact::class);

        $totalContacts = Contact::count();
        return response()->json(['total_contacts' => $totalContacts]);
    }
}