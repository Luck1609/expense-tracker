<?php

namespace App\Enums;

enum CategoryType: string
{
  case INCOME = 'income';
  case EXPENSE = 'expense';
  case BOTH = 'both';
}
