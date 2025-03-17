<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $table = 'product';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'label',
        'image',
        'price',
        'spek',
        'stok',
        'shared',
        'recommended',
        'show'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
