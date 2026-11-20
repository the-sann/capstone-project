<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Material extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'material_category_id',
        'sku',
        'name',
        'unit',
        'min_stock',
        'current_stock',
        'unit_cost',
        'track_expiry',
        'is_active',
        'description',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'min_stock' => 'decimal:2',
            'current_stock' => 'decimal:2',
            'unit_cost' => 'decimal:2',
            'track_expiry' => 'boolean',
            'is_active' => 'boolean',
        ];
    }


    protected $appends = ['image_url'];

    protected function imageUrl(): Attribute
    {
        return Attribute::get(
            fn() => $this->image_path ? Storage::disk('public')->url($this->image_path) : null
        );
    }
    public function category(): BelongsTo
    {
        return $this->belongsTo(MaterialCategory::class, 'material_category_id');
    }

    public function batches(): HasMany
    {
        return $this->hasMany(MaterialBatch::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock(Builder $query): Builder
    {
        return $query->whereColumn('current_stock', '<=', 'min_stock');
    }

    protected function isLowStock(): Attribute
    {
        return Attribute::get(fn() => (float) $this->current_stock <= (float) $this->min_stock);
    }
}
