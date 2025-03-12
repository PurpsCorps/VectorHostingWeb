<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DataModel;
use Illuminate\Http\Request;

class DataControllers extends Controller
{
    public function index()
    {
        // Ambil semua data
        $data = DataModel::all();

        return response()->json($data);
    }

    public function show($id)
    {
        $data = DataModel::findOrFail($id);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|max:255',
            'label' => 'required|max:255',
            'price' => 'required',
            'spek' => 'required',
            'stok' => 'required',
        ]);

        $data = DataModel::create($validatedData);
        return response()->json($data, 201);
    }
}