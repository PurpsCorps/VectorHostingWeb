<?php

namespace App\Http\Controllers;

use App\Models\UserCart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $validatedData = $request->validate([
                'user_id' => 'required',
                'cart' => 'required',
                'count' => 'required',
            ]);

            $data = UserCart::create($validatedData);
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
        try{
            $data = UserCart::findOrFail($id);
            return response()->json($data);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(0);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            // Cari user berdasarkan ID
            $user = UserCart::findOrFail($id);

            // Validasi input
            $request->validate([
                'cart' => 'required',
                'count' => 'integer',
            ]);

            // Update hanya kolom token
            $user->cart = $request->cart;
            if($request->order) {
                $user->count = 0;
            } else {
                $request->count? $user->count = $request->count : $user->count = $user->count;
            }
            $user->save();

            // Kembalikan response sukses
            return response()->json([
                'success' => true,
                'message' => 'Data Cart berhasil diperbarui',
                'data' => $user
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
