#!/bin/bash
# protect-files.sh
# PreToolUse hook — blocks Edit/Write to files matched by PROTECTED_PATTERNS.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")
SAFE_SUFFIXES=(".example" ".sample" ".template")

for suffix in "${SAFE_SUFFIXES[@]}"; do
  if [[ "$FILE_PATH" == *"$suffix" ]]; then
    exit 0
  fi
done

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    jq -n \
      --arg reason "Blocked: '$FILE_PATH' matches protected pattern '$pattern'" \
      '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $reason}}'
    exit 0
  fi
done
exit 0
