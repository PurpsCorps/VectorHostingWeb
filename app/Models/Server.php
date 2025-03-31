<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Server extends Model
{
    protected $table = 'servers';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'name',
        'location',
        'cpu_cores',
        'memory_gb',
        'disk_gb',
        'bandwidth_tb',
        'status'
    ];
}
