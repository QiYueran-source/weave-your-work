# Restock list process

Produce one restock list per week from the sales export.

## Inputs

- `data/sales-weeks.csv`: the four most recent weeks of sales, one row per product per week.
- The new week's export, in the same columns.
- Columns read: `date`, `sku`, `product`, `supplier`, `units_sold`, `on_hand`.

## Arithmetic

- Average: the mean `units_sold` over the four most recent weeks for one SKU.
- Cover: `on_hand` divided by that average, in weeks.
- A product needs reordering when cover is below two weeks.
- Quantity: two weeks of the average minus `on_hand`, rounded up.

## Output

`results/restock-<date>.csv`, with columns `supplier`, `sku`, `product`, `average_weekly_units`, `cover_weeks`, `quantity`. One row per product below two weeks of cover, sorted by supplier, then SKU.

## Assumption

The four weeks are treated as a normal month. A promotion or a holiday week inside the window biases the average, so a week that is not normal is named when the list is produced.
