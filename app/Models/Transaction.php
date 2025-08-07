<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use App\Models\TransactionItem;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode',
        'user_id',
        'nama_pembeli',
        'total_item',
        'total_harga',
    ];

    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function kasir()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
