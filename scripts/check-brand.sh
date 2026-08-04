#!/usr/bin/env bash
# Fails the build if the old brand or any developer annotation leaks into the app.
set -euo pipefail

BAD='bharani|Bharani|BHARANI|since 1978|1978 முதல்|Lakshmi|LAKSHMI|SECOND GENERATION|பரணி பட்டு'
ANNOT='hero video ·|silent loop|cubic-bezier\(\.16|prefers-reduced-motion →|curator portrait ·|· 3/4 drape|poster first|drape loop'

# Build list of directories that actually exist
DIRS=()
for d in src public content; do
  [ -d "$d" ] && DIRS+=("$d")
done

fail=0
if [ ${#DIRS[@]} -gt 0 ] && grep -rInE "$BAD" "${DIRS[@]}" 2>/dev/null; then
  echo "✗ old brand strings found (see above)"; fail=1
fi
if [ ${#DIRS[@]} -gt 0 ] && grep -rInE "$ANNOT" "${DIRS[@]}" 2>/dev/null; then
  echo "✗ developer annotation would render as copy (see above)"; fail=1
fi
[ "$fail" -eq 0 ] && echo "✓ brand clean"
exit $fail
