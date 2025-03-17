<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product', function (Blueprint $table) {
            $table->id()->primary();;
            $table->string('name');
            $table->string('label');
            $table->integer('price');
            $table->json('spek');
            $table->integer('stok');
            $table->string('category');
            $table->integer('recommended');
            $table->integer('show');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
