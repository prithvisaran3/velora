#!/usr/bin/env bash
# Fails the build if the old brand or any developer annotation leaks into the app.
set -euo pipefail

BAD='bharani|Bharani|BHARANI|since 1978|1978 முதல்|Lakshmi|LAKSHMI|SECOND GENERATION|பரணி பட்டு'
ANNOT='hero video ·|silent loop|cubic-bezier\(\.16|prefers-reduced-motion →|curator portrait ·|· 3/4 drape|poster first|drape loop'

fail=0
if grep -rInE "$BAD" src public content 2>/dev/null; then
  echo "✗ old brand strings found (see above)"; fail=1
fi
if grep -rInE "$ANNOT" src public content 2>/dev/null; then
  echo "✗ developer annotation would render as copy (see above)"; fail=1
fi
[ "$fail" -eq 0 ] && echo "✓ brand clean"
exit $fail
