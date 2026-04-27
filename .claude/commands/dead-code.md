Scan the August Pirraglia portfolio for dead code and stale assets.

Focus on:
- Unused CSS selectors and orphaned markup hooks.
- Unreferenced TypeScript imports, constants, and functions.
- Public assets that are no longer referenced by `src`.
- Generated build output that should not be treated as source.

Do not delete anything automatically. Return findings with file paths, line references, confidence, and the safest cleanup order.
