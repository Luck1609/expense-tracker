<?php

namespace App\Http\Requests;

use App\Enums\TransactionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', new Enum(TransactionType::class)],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'date' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
            'category_id' => ['nullable', 'string', Rule::exists('categories', 'id')],
            'income_source_id' => ['nullable', 'string', Rule::exists('income_sources', 'id')],
            'label_ids' => ['nullable', 'array'],
            'label_ids.*' => ['string', Rule::exists('labels', 'id')],
        ];
    }
}
