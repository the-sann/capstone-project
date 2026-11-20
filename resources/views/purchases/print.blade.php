<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $purchase->reference_no }}</title>
    <style>
        @page { size: A4; margin: 15mm; }

        * { box-sizing: border-box; }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #111;
            margin: 0;
            background: #f3f4f6;
        }
        .sheet {
            width: 210mm;
            min-height: 297mm;
            margin: 10px auto;
            padding: 15mm;
            background: #fff;
        }
        .toolbar { width: 210mm; margin: 10px auto 0; text-align: right; }
        .toolbar button {
            padding: 8px 16px; border: 0; border-radius: 6px;
            background: #111; color: #fff; cursor: pointer; font-size: 13px;
        }

        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #111; padding-bottom: 10px; }
        .header h1 { margin: 0; font-size: 20px; }
        .header .title { text-align: right; }
        .header .title h2 { margin: 0; font-size: 18px; letter-spacing: 1px; }

        .meta { display: flex; justify-content: space-between; margin: 16px 0; gap: 20px; }
        .meta div { flex: 1; }
        .meta h3 { margin: 0 0 4px; font-size: 11px; text-transform: uppercase; color: #666; }
        .meta p { margin: 2px 0; }

        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        thead { display: table-header-group; } /* repeat header on every page */
        tr { page-break-inside: avoid; }
        th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; }
        th { background: #eee; font-size: 11px; text-transform: uppercase; }
        .num { text-align: right; white-space: nowrap; }
        .total td { font-weight: bold; background: #f7f7f7; }

        .note { margin-top: 14px; }

        .signatures { display: flex; justify-content: space-between; gap: 30px; margin-top: 70px; }
        .signatures div { flex: 1; text-align: center; }
        .signatures .line { border-top: 1px solid #111; padding-top: 4px; }

        @media print {
            body { background: #fff; }
            .toolbar { display: none; }
            .sheet { margin: 0; padding: 0; width: auto; min-height: auto; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="toolbar">
        <button onclick="window.print()">Print / Save as PDF</button>
    </div>

    <div class="sheet">
        <div class="header">
            <div>
                <h1>{{ config('app.name') }}</h1>
                <div>Dental clinic</div>
            </div>
            <div class="title">
                <h2>PURCHASE ORDER</h2>
                <div>{{ $purchase->reference_no }}</div>
            </div>
        </div>

        <div class="meta">
            <div>
                <h3>Supplier</h3>
                <p><strong>{{ $purchase->supplier?->name ?? 'No supplier' }}</strong></p>
                @if ($purchase->supplier?->phone)<p>{{ $purchase->supplier->phone }}</p>@endif
                @if ($purchase->supplier?->email)<p>{{ $purchase->supplier->email }}</p>@endif
                @if ($purchase->supplier?->address)<p>{{ $purchase->supplier->address }}</p>@endif
            </div>
            <div>
                <h3>Order details</h3>
                <p>Date: {{ $purchase->purchase_date->format('d M Y') }}</p>
                <p>Status: {{ ucfirst($purchase->status->value) }}</p>
                <p>Prepared by: {{ $purchase->creator?->name ?? '-' }}</p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 28px">#</th>
                    <th>SKU</th>
                    <th>Material</th>
                    <th>Batch</th>
                    <th>Expiry</th>
                    <th class="num">Qty</th>
                    <th class="num">Unit cost</th>
                    <th class="num">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($purchase->items as $i => $item)
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>{{ $item->material->sku }}</td>
                        <td>{{ $item->material->name }}</td>
                        <td>{{ $item->batch_no ?? '-' }}</td>
                        <td>{{ $item->expiry_date?->format('d M Y') ?? '-' }}</td>
                        <td class="num">{{ rtrim(rtrim(number_format($item->quantity, 2), '0'), '.') }} {{ $item->material->unit }}</td>
                        <td class="num">${{ number_format($item->unit_cost, 2) }}</td>
                        <td class="num">${{ number_format($item->subtotal, 2) }}</td>
                    </tr>
                @endforeach
                <tr class="total">
                    <td colspan="7" class="num">Total</td>
                    <td class="num">${{ number_format($purchase->total_amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        @if ($purchase->note)
            <p class="note"><strong>Note:</strong> {{ $purchase->note }}</p>
        @endif

        <div class="signatures">
            <div><div class="line">Prepared by</div></div>
            <div><div class="line">Approved by</div></div>
            <div><div class="line">Received by</div></div>
        </div>
    </div>
</body>
</html>