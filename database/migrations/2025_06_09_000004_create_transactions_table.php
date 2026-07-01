<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('transactions', function (Blueprint $table) {
      $table->uuid('id')->primary()->unique();
      $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
      $table->foreignUuid('category_id')->nullable()->constrained()->nullOnDelete();
      $table->foreignUuid('income_source_id')->nullable()->constrained()->nullOnDelete();
      $table->string('type'); // ['income', 'expense']
      $table->decimal('amount', 10, 2);
      $table->date('date');
      $table->text('notes')->nullable();
      $table->timestamps();
      $table->softDeletes();

      $table->index('user_id');
      $table->index('category_id');
      $table->index('income_source_id');
      $table->index('date');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('transactions');
  }
};
