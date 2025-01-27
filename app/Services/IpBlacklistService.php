<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IpBlacklistService
{
    private const MAX_ATTEMPTS = 5;
    private const ATTEMPT_EXPIRY = 300; // 5 minutes in seconds
    private const BLOCK_DURATION = 3600; // 1 hour in seconds

    /**
     * Check if an IP is blacklisted
     */
    public function isBlacklisted(string $ip): bool
    {
        return Cache::has("blacklist:{$ip}");
    }

    /**
     * Record an attempt and potentially block the IP
     */
    public function recordAttempt(string $ip, string $attemptType = 'login'): bool
    {
        $key = "attempts:{$ip}:{$attemptType}";
        $attempts = Cache::get($key, 0) + 1;

        // Store attempt in cache with expiration
        Cache::put($key, $attempts, Carbon::now()->addSeconds(self::ATTEMPT_EXPIRY));

        // Log attempt in database
        DB::table('access_attempts')->insert([
            'ip' => $ip,
            'attempt_type' => $attemptType,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // If max attempts exceeded, add to blacklist
        if ($attempts >= self::MAX_ATTEMPTS) {
            $this->addToBlacklist($ip);
            return true;
        }

        return false;
    }

    /**
     * Reset attempts counter for an IP
     */
    public function resetAttempts(string $ip, string $attemptType = 'login'): void
    {
        $key = "attempts:{$ip}:{$attemptType}";
        Cache::forget($key);
    }

    /**
     * Add an IP to the blacklist
     */
    public function addToBlacklist(string $ip): void
    {
        $now = Carbon::now();
        $expiresAt = $now->copy()->addSeconds(self::BLOCK_DURATION);

        // Add to cache
        Cache::put(
            "blacklist:{$ip}",
            true,
            $expiresAt
        );

        // Add to database
        DB::table('blocked_ips')->insert([
            'ip' => $ip,
            'blocked_at' => $now,
            'expires_at' => $expiresAt,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    /**
     * Remove an IP from the blacklist
     */
    public function removeFromBlacklist(string $ip): void
    {
        // Remove from cache
        Cache::forget("blacklist:{$ip}");

        // Update database
        DB::table('blocked_ips')
            ->where('ip', $ip)
            ->update([
                'unblocked_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
    }

    /**
     * Get currently blocked IPs
     */
    public function getBlockedIPs()
    {
        return DB::table('blocked_ips')
            ->whereNull('unblocked_at')
            ->where('expires_at', '>', Carbon::now())
            ->orderByDesc('blocked_at')
            ->get();
    }

    /**
     * Get attempt count for an IP
     */
    public function getAttemptCount(string $ip, string $attemptType = 'login'): int
    {
        return Cache::get("attempts:{$ip}:{$attemptType}", 0);
    }

    /**
     * Get detailed statistics of blocked IPs
     */
    public function getBlockedIPsStats(): array
    {
        $now = Carbon::now();

        // Currently blocked IPs
        $currentlyBlocked = DB::table('blocked_ips')
            ->whereNull('unblocked_at')
            ->where('expires_at', '>', $now)
            ->count();

        // Manually unblocked IPs
        $manuallyUnblocked = DB::table('blocked_ips')
            ->whereNotNull('unblocked_at')
            ->count();

        // Expired blocks
        $expired = DB::table('blocked_ips')
            ->whereNull('unblocked_at')
            ->where('expires_at', '<=', $now)
            ->count();

        // Total unique IPs ever blocked
        $totalUnique = DB::table('blocked_ips')
            ->distinct('ip')
            ->count('ip');

        // Repeat offenders (blocked multiple times)
        $repeatOffenders = DB::table('blocked_ips')
            ->select('ip')
            ->groupBy('ip')
            ->havingRaw('COUNT(*) > 1')
            ->count();

        return [
            'currently_blocked' => $currentlyBlocked,
            'manually_unblocked' => $manuallyUnblocked,
            'expired' => $expired,
            'total_unique' => $totalUnique,
            'repeat_offenders' => $repeatOffenders,
            'total_blocks' => $currentlyBlocked + $manuallyUnblocked + $expired
        ];
    }
}