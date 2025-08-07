<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Category;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['nama', 'harga', 'stok', 'kategori_id'];

    public function kategori()
    {
        return $this->belongsTo(Category::class, 'kategori_id');
    }
}
