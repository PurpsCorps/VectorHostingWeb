<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketReplies extends Model
{
    protected $table = 'ticket_replies';

    protected $primaryKey = 'id';

    public $timestamps = true;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'staff_id',
        'message'
    ];
}
