<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\IpBlacklistService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BlacklistController extends Controller
{
    public function __construct(
        private readonly IpBlacklistService $blacklistService
    ) {
        // No need for middleware here as it's already in the routes
    }

    /**
     * Get list of blocked IPs
     */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', 'App\Models\Blacklist');

        $blockedIps = $this->blacklistService->getBlockedIPs();

        return response()->json([
            'blocked_ips' => $blockedIps
        ]);
    }

    /**
     * Block an IP address
     */
    public function blockIp(Request $request): JsonResponse
    {
        $this->authorize('block', 'App\Models\Blacklist');

        $validated = $request->validate([
            'ip' => ['required', 'ip']
        ]);

        $this->blacklistService->addToBlacklist($validated['ip']);

        return response()->json([
            'message' => 'IP blocked successfully'
        ]);
    }

    /**
     * Unblock an IP address
     */
    public function unblockIp(Request $request): JsonResponse
    {
        $this->authorize('unblock', 'App\Models\Blacklist');

        $validated = $request->validate([
            'ip' => ['required', 'ip']
        ]);

        $this->blacklistService->removeFromBlacklist($validated['ip']);

        return response()->json([
            'message' => 'IP unblocked successfully'
        ]);
    }

    /**
     * Get detailed statistics of blocked IPs
     */
    public function stats(): JsonResponse
    {
        $this->authorize('viewAny', 'App\Models\Blacklist');

        $stats = $this->blacklistService->getBlockedIPsStats();

        return response()->json($stats);
    }

}