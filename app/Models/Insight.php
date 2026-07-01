<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Insight extends Model
{
  use HasFactory, HasUuids, SoftDeletes;

  protected $fillable = [
    'user_id',
    'title',
    'message',
    'type',
    'generated_at',
    'is_read',
    'dismissed_at',
  ];

  protected function casts(): array
  {
    return [
      'generated_at' => 'datetime',
      'dismissed_at' => 'datetime',
      'is_read' => 'boolean',
    ];
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
