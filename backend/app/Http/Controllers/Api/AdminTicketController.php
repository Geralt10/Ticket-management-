<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminTicketController extends Controller
{
    public function index(): JsonResponse
    {
        $tickets = Ticket::query()
            ->with('user:id,name,username')
            ->latest()
            ->get();

        return response()->json([
            'tickets' => $tickets,
            'statuses' => [
                Ticket::STATUS_OPEN,
                Ticket::STATUS_IN_PROGRESS,
                Ticket::STATUS_CLOSED,
            ],
        ]);
    }

    public function update(Request $request, Ticket $ticket): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in([
                Ticket::STATUS_OPEN,
                Ticket::STATUS_IN_PROGRESS,
                Ticket::STATUS_CLOSED,
            ])],
        ]);

        $ticket->update($validated);

        return response()->json([
            'message' => 'Ticket status updated.',
            'ticket' => $ticket->load('user:id,name,username'),
        ]);
    }

    public function destroy(Ticket $ticket): JsonResponse
    {
        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted.',
        ]);
    }
}
