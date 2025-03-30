<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PaymentProofController extends Controller
{
    public function index()
    {
        //
    }
    /**
     * Upload payment proof for an order
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) {
        if (!$request->hasFile('payment_proof')) {
            return response()->json([
                'status' => 'error',
                'message' => 'No file uploaded'
            ], 400);
        }
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'payment_proof' => 'required|image|mimes:jpeg,jpg,png|max:2048', // max 2MB
            'order_id' => 'required|string',
            'user_id' => 'required|exists:users,id'
        ]);

        // Check validation fails
        if ($validator->fails()) {

            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        try {
            // Check if file is actually present
            if (!$request->hasFile('payment_proof')) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No file uploaded'
                ], 400);
            }

            // Get the file
            $file = $request->file('payment_proof');

            // Validate file upload
            if (!$file->isValid()) {

                return response()->json([
                    'status' => 'error',
                    'message' => 'File upload failed'
                ], 400);
            }

            // Generate a unique filename
            $orderId = $request->input('order_id');
            $filename = 'payment_proof_' . $orderId . '_' . time() . '.' . $file->getClientOriginalExtension();

            // Store the file
            $path = $file->storeAs('temp_payment_proofs', $filename, 'public');


            return response()->json([
                'status' => 'success',
                'message' => 'Payment proof uploaded successfully',
                'file_path' => $path,
                'filename' => $filename
            ]);

        } catch (\Exception $e) {
            // Log the full error for debugging


            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while uploading payment proof. ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $request->validate([
                'order_id' => 'required|string',
                'temp_filename' => 'required|string'
            ]);

            $tempFilename = $request->temp_filename;

            // Path for temporary and permanent storage
            $tempPath = 'temp_payment_proofs/' . $tempFilename;
            $permanentPath = 'payment_proofs/' . $tempFilename;

            // Check if temporary file exists
            if (!Storage::disk('public')->exists($tempPath)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Temporary payment proof not found'
                ], 404);
            }

            // Move file to permanent storage
            Storage::disk('public')->move($tempPath, $permanentPath);

            return response()->json([
                'status' => 'success',
                'message' => 'Payment proof confirmed',
                'file_path' => $permanentPath
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while confirming payment proof'
            ], 500);
        }
    }
}