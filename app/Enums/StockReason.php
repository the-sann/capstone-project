<?php

namespace App\Enums;

enum StockReason: string
{
    case Purchase = 'purchase';
    case Opening = 'opening';
    case Used = 'used';
    case Expired = 'expired';
    case Damaged = 'damaged';
    case Lost = 'lost';
    case Returned = 'returned';
    case Correction = 'correction';

    public function label(): string
    {
        return ucfirst($this->value);
    }
}
