<?php

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transaction extends Model
{
  use HasFactory, HasUuids, SoftDeletes;

  protected $fillable = [
    'type',
    'amount',
    'date',
    'notes',
    'category_id',
    'income_source_id',
    'user_id',
  ];

  protected function casts(): array
  {
    return [
      'type' => TransactionType::class,
      'amount' => 'decimal:2',
      'date' => 'date',
    ];
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function category(): BelongsTo
  {
    return $this->belongsTo(Category::class);
  }

  public function incomeSource(): BelongsTo
  {
    return $this->belongsTo(IncomeSource::class);
  }

  public function labels(): BelongsToMany
  {
    return $this->belongsToMany(Label::class, 'transaction_label');
  }
}
