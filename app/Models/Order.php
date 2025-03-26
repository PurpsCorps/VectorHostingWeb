<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'user_id',
        'items',
        'payment_method',
        'total',
        'subtotal',
        'status',
        'payment_proof'
    ];
}
