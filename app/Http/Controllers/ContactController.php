<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Http\Requests\Contact\StoreRequest;
use App\Http\Requests\Contact\UpdateRequest;
use App\Http\Requests\Contact\UpdateStatusRequest;
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

    public function store(StoreRequest $request): JsonResponse
    {
        $contact = Contact::create($request->validated());

        return response()->json([
            'message' => 'Contacto creado correctamente',
            'contact' => $contact
        ], 201);
    }

    public function show(Contact $contact): JsonResponse
    {
        return response()->json($contact);
    }

    public function update(UpdateRequest $request, Contact $contact): JsonResponse
    {
        $contact->update($request->validated());

        return response()->json([
            'message' => 'Contacto actualizado correctamente',
            'contact' => $contact
        ]);
    }

    public function updateStatus(UpdateStatusRequest $request, Contact $contact): JsonResponse
    {
        $contact->update($request->validated());

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