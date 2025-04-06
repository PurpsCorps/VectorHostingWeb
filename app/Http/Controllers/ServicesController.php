<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Service::all();
        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $validatedData = $request->validate([
                'order_id' => 'required|string',
                'user_id' => 'required|integer',
                'name' => 'required|string',
                'type' => 'required|in:vps,hosting,storage,domain',
                'domain' => 'required|string',
                'ip' => 'required|string',
                'plan' => 'required|string',
                'status' => 'required|in:active,pending,suspended,cancelled',
                'renewal_date' => 'required',
                'server_id' => 'required|integer',
            ]);

            $data = Service::create($validatedData);

            return response()->json($data, 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Service::where('user_id', $id)->get();
        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
