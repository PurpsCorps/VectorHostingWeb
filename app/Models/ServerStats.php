<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServerStats extends Model
{
    protected $table = 'server_stats';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'server_id',
        'cpu_usage',
        'memory_usage',
        'disk_usage',
        'bandwidth_usage'
    ];
}
