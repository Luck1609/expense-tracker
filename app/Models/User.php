<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
  /** @use HasFactory<UserFactory> */
  use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
      'two_factor_confirmed_at' => 'datetime',
    ];
  }

  public function categories(): HasMany
  {
    return $this->hasMany(Category::class);
  }

  public function incomeSources(): HasMany
  {
    return $this->hasMany(IncomeSource::class);
  }

  public function labels(): HasMany
  {
    return $this->hasMany(Label::class);
  }

  public function transactions(): HasMany
  {
    return $this->hasMany(Transaction::class);
  }
}
