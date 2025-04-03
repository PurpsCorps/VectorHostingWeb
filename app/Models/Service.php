<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'services';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'order_id',
        'user_id',
        'name',
        'type',
        'domain',
        'ip',
        'plan',
        'status',
        'renewal_date',
        'server_id'
    ];
}
