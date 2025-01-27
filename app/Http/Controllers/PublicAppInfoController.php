<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AppInfo;
use Illuminate\Http\JsonResponse;

class PublicAppInfoController extends Controller
{
    public function index(): JsonResponse
    {
        $appInfo = AppInfo::firstOrCreate([]);
        return response()->json($appInfo);
    }
}