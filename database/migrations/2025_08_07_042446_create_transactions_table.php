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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique(); // TRX-20250807-0001
            $table->unsignedBigInteger('user_id'); // kasir
            $table->string('nama_pembeli')->nullable(); // bisa dikosongkan kalau tidak tahu
            $table->integer('total_item'); // jumlah item total
            $table->decimal('total_harga', 15, 2); // total rupiah
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
