<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
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
                'order_id' => 'required|string',
                'user_id' => 'required|integer',
                'items' => 'required',
                'payment_method' => 'required|string',
                'subtotal' => 'required|integer',
                'total' => 'required|integer',
                'status' => 'required|string',
                'payment_proof' => 'required|string',
            ]);

            $data = Order::create($validatedData);

            $curl = curl_init();

            curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://api.fonnte.com/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => array(
                'target' => '08973966207',
                'message' => '*Orderan Baru Masuk*
#' . $request->order_id . '
Silahkan menuju ke Admin Dashboard untuk memerika bukti pembayaran!'
            ),
            CURLOPT_HTTPHEADER => array(
                'Authorization: ' . env('WA_TOKEN') //change TOKEN to your actual token
            ),
            ));

            curl_exec($curl);
            curl_close($curl);

            $curl2 = curl_init();

            curl_setopt_array($curl2, array(
            CURLOPT_URL => 'https://api.fonnte.com/send',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => array(
                'target' => $request->user_phone,
                'message' => '*Orderan Anda Telah Kami Terima*
*Order ID:* #' . $request->order_id . '
*Subtotal:* Rp. ' . $request->subtotal . '
*Mohon menunggu Admin untuk Persetujuan Pembayaran!*

Selalu Pantau Order Status mu di
https://vector-hosting.com/client

**Terima Kasih Sudah Berbelanja.**'
            ),
            CURLOPT_HTTPHEADER => array(
                'Authorization: ' . env('WA_TOKEN') //change TOKEN to your actual token
            ),
            ));

            curl_exec($curl2);
            curl_close($curl2);

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
        //
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
