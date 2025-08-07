<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(10));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $kategori = Category::create([
            'nama' => $request->nama,
        ]);

        return response()->json($kategori, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $kategori = Category::findOrFail($id);
        $kategori->update([
            'nama' => $request->nama,
        ]);

        return response()->json($kategori);
    }

    public function destroy($id)
    {
        $kategori = Category::findOrFail($id);
        $kategori->delete();

        return response()->json(['message' => 'Kategori dihapus']);
    }

    public function all()
    {
        return response()->json(Category::orderBy('nama')->get());
    }

}
