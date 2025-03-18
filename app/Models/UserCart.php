<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCart extends Model
{
    protected $table = 'user_cart';

    protected $primaryKey = 'user_id';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'cart',
        'count'
    ];
}
