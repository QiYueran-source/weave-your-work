# What this example does not show

- **A retire-and-replace run.** The seven-step order in `content.md` is derived from waymark's constraints — archived tickets reject writes, maps with active children cannot be archived, a child pointing at an archived parent breaks `validate`. No node in this repository has been through it. The first real one is the test of that order, and the order is expected to change once.
- **A cross-owner write.** All 51 tickets have the same owner, so the notify-afterwards rule has never run. The issue it depends on belongs to [the communication map](../../../tickets/map/wm-25b3q7mg88c7.md), which is still in design.
- **A split map whose content changed.** The update skill's second trigger — a map that has already split but is still open — is stated in the design and has no worked example behind it.
