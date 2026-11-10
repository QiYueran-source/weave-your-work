# The tasks

Four tasks ran, and a fifth replaced the first probe later (see [the update](05-the-update.md)).

**The probe** ([wm-0166b95n66vf](work/task/wm-0166b95n66vf.md), archived). It asked whether every product appears in all four weeks of `data/sales-weeks.csv`. The answer was yes: five SKUs, four rows each. A probe carries two `Next step` lines written before it runs, and both were written: if it holds, average the four most recent weeks and state the window; if not, average the weeks present and write the gap into the list. The map's owner confirmed both lines when the answer landed, and `Result` records that.

**The list** ([wm-s30qv26apwtv](work/task/wm-s30qv26apwtv.md)). It produced [`results/restock-2026-11-02.csv`](results/restock-2026-11-02.csv):

| supplier | sku | average | cover | quantity |
|---|---|---|---|---|
| North Roast | SKU-1001 | 42.00 | 1.43 | 24 |
| North Roast | SKU-1004 | 7.50 | 1.60 | 3 |
| Pack Supply | SKU-1003 | 201.25 | 0.75 | 253 |

SKU-1002 and SKU-1005 are at or above two weeks of cover and are not in the file. Each quantity is two weeks of the average minus the on-hand stock: 84−60, 15−12, and 403−150.

**The page** ([wm-tath3j1wcym1](work/task/wm-tath3j1wcym1.md)). It wrote [`results/process.md`](results/process.md): the input files, the columns read, the average and cover formulas, the two-week threshold, the output columns, and the normal-month assumption. A reader who has not seen the ticket can produce the next list from it, which is what its acceptance signal asks.

**The second list** ([wm-1h6zzafwyxfy](work/task/wm-1h6zzafwyxfy.md)). It produced [`results/restock-2026-11-09.csv`](results/restock-2026-11-09.csv) from `data/week-five.csv` and the three earlier weeks, and placed a byte-identical copy in [`results/sent/`](results/sent/restock-2026-11-09.csv):

| supplier | sku | average | cover | quantity |
|---|---|---|---|---|
| North Roast | SKU-1001 | 42.75 | 1.40 | 26 |
| North Roast | SKU-1004 | 7.50 | 1.60 | 3 |
| Pack Supply | SKU-1003 | 200.75 | 0.75 | 252 |

The numbers differ from the first list because the window moved: the four most recent weeks now include the new export, so the averages and quantities were recomputed rather than copied.

One step did not work first time. The first copy was read and written in text mode, which turned the file's CRLF line ends into LF, and `cmp` reported a difference at byte 63. The copy was redone as a byte copy, `cmp` passed, and the failed attempt stayed in `Result` instead of being dropped.
