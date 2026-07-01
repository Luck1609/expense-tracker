<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insights', function (Blueprint $table) {
            $table->uuid('id')->primary()->unique();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 200);
            $table->text('message');
            $table->string('type'); // ['spending_trend', 'saving_tip', 'warning', 'summary']
            $table->timestamp('generated_at');
            $table->boolean('is_read')->default(false);
            $table->timestamp('dismissed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('type');
            $table->index('is_read');
            $table->index('generated_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insights');
    }
};
