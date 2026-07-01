<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('transaction_label', function (Blueprint $table) {
      $table->uuid('id')->primary()->unique();
      $table->foreignUuid('transaction_id')->constrained('transactions')->onDelete('cascade');
      $table->foreignUuid('label_id')->constrained('labels')->onDelete('cascade');

      $table->index('label_id');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('transaction_label');
  }
};
