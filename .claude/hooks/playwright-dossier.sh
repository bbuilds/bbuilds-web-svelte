#!/usr/bin/env bash
#
# playwright-dossier.sh — PostToolUse hook: failure-triage dossier.
#
# After a `playwright test` run reports failures, emit a compact dossier as
# `additionalContext` so the agent triages from structured signal (title, file,
# line, project, full error, screenshot/trace paths, repro command, plus the
# Phase-5 `console`/`network` attachments) instead of unzipping the trace blind.
#
# Stays silent unless ALL hold:
#   1. the Bash command was a `playwright test` run,
#   2. playwright-report/results.json reports failures (.stats.unexpected/.flaky),
#   3. that results.json is FRESH — its mtime is strictly newer than the last one
#      this hook processed (persisted in ./.dossier-seen at the project root, which
#      Playwright never wipes — see note at the marker below). This ignores
#      a stale results.json left when the webServer build aborts before tests run.
#
# jq-only and `|| true`-resilient: a parse miss exits 0 silently, never breaking
# the agent loop. Deliberately no `set -e`.
set -uo pipefail

input="$(cat 2>/dev/null || true)"

# 1. Only react to `playwright test` Bash commands.
command="$(printf '%s' "$input" | jq -r '.tool_input.command // ""' 2>/dev/null || true)"
case "$command" in
*"playwright test"*) ;;
*) exit 0 ;;
esac

root="${CLAUDE_PROJECT_DIR:-$PWD}"
report="$root/playwright-report/results.json"
[ -f "$report" ] || exit 0

# 2. Require failures.
unexpected="$(jq -r '.stats.unexpected // 0' "$report" 2>/dev/null || echo 0)"
flaky="$(jq -r '.stats.flaky // 0' "$report" 2>/dev/null || echo 0)"
case "$unexpected" in '' | *[!0-9]*) unexpected=0 ;; esac
case "$flaky" in '' | *[!0-9]*) flaky=0 ;; esac
if [ "$unexpected" -le 0 ] && [ "$flaky" -le 0 ]; then
	exit 0
fi

# 3. Freshness via a marker file (NOT mtime-vs-hook-start, which can never hold:
#    the hook runs after the run wrote results.json). Emit only when results.json
#    is strictly newer than the last mtime we processed, then advance the marker.
#    The marker lives at the project root, NOT under test-results/ or
#    playwright-report/ — Playwright wipes outputDir (test-results) at the start of
#    every run and the HTML reporter regenerates playwright-report, either of which
#    would erase the marker and defeat this guard: on an aborted build the marker
#    would be gone while a stale results.json survived, so the stale report would
#    pass the freshness check — exactly the case this guards against.
marker="$root/.dossier-seen"
mtime="$(stat -f %m "$report" 2>/dev/null || stat -c %Y "$report" 2>/dev/null || echo 0)"
case "$mtime" in '' | *[!0-9]*) mtime=0 ;; esac
seen=0
if [ -f "$marker" ]; then
	seen="$(cat "$marker" 2>/dev/null || echo 0)"
	case "$seen" in '' | *[!0-9]*) seen=0 ;; esac
fi
if [ "$mtime" -le "$seen" ]; then
	exit 0
fi
mkdir -p "$(dirname "$marker")" 2>/dev/null || true
printf '%s' "$mtime" >"$marker" 2>/dev/null || true

# One record per test, classified by the test's FINAL status — NOT per attempt.
# A flaky test (failed once, passed on retry) has status "flaky" and must not be
# framed as "failing"; a hard failure has status "unexpected". Diagnostics come
# from that test's first failing attempt either way.
failures="$(jq -c '
  [ .. | objects | select(has("tests") and has("file") and has("line")) ] as $specs
  | [ $specs[]
      | . as $spec
      | $spec.tests[]?
      | . as $test
      | select(.status == "unexpected" or .status == "flaky")
      | ( [ $test.results[]?
            | select(.status == "unexpected" or .status == "failed" or .status == "timedOut") ]
          | first ) as $r
      | { kind: $test.status,
          title: $spec.title,
          file: $spec.file,
          line: $spec.line,
          project: ($test.projectName // ""),
          error: (($r.error.message) // (($r.errors // []) | map(.message) | join("\n\n")) // ""),
          attachments: ($r.attachments // []) } ]
' "$report" 2>/dev/null || echo '[]')"

count="$(printf '%s' "$failures" | jq 'length' 2>/dev/null || echo 0)"
case "$count" in '' | *[!0-9]*) count=0 ;; esac
[ "$count" -gt 0 ] || exit 0

failed_count="$(printf '%s' "$failures" | jq '[.[] | select(.kind == "unexpected")] | length' 2>/dev/null || echo 0)"
flaky_count="$(printf '%s' "$failures" | jq '[.[] | select(.kind == "flaky")] | length' 2>/dev/null || echo 0)"
case "$failed_count" in '' | *[!0-9]*) failed_count=0 ;; esac
case "$flaky_count" in '' | *[!0-9]*) flaky_count=0 ;; esac

# Resolve an attachment reference to its text, reading the on-disk file (the JSON
# reporter references text attachments by `path`) or decoding an inline `body`.
attachment_text() {
	local item="$1" name="$2" att apath abody
	att="$(printf '%s' "$item" | jq -c --arg n "$name" 'first(.attachments[]? | select(.name == $n)) // empty' 2>/dev/null || true)"
	[ -n "$att" ] || return 0
	apath="$(printf '%s' "$att" | jq -r '.path // empty' 2>/dev/null || true)"
	abody="$(printf '%s' "$att" | jq -r '.body // empty' 2>/dev/null || true)"
	if [ -n "$apath" ]; then
		case "$apath" in /*) ;; *) apath="$root/$apath" ;; esac
		[ -f "$apath" ] && cat "$apath" 2>/dev/null || true
	elif [ -n "$abody" ]; then
		printf '%s' "$abody" | base64 -d 2>/dev/null || printf '%s' "$abody"
	fi
}

# Header reflects the mix: hard failures and flaky (recovered-on-retry) are
# distinct outcomes, never lumped together as "failing".
if [ "$failed_count" -gt 0 ] && [ "$flaky_count" -gt 0 ]; then
	dossier="# Playwright triage dossier — $failed_count failing, $flaky_count flaky (recovered on retry)"
elif [ "$failed_count" -gt 0 ]; then
	dossier="# Playwright failure dossier — $failed_count failing"
else
	dossier="# Playwright flaky dossier — $flaky_count flaky (passed on retry, suite is green)"
fi
i=0
while [ "$i" -lt "$count" ]; do
	item="$(printf '%s' "$failures" | jq -c ".[$i]" 2>/dev/null || echo '{}')"
	kind="$(printf '%s' "$item" | jq -r '.kind // ""' 2>/dev/null || true)"
	title="$(printf '%s' "$item" | jq -r '.title // ""' 2>/dev/null || true)"
	file="$(printf '%s' "$item" | jq -r '.file // ""' 2>/dev/null || true)"
	line="$(printf '%s' "$item" | jq -r '.line // ""' 2>/dev/null || true)"
	project="$(printf '%s' "$item" | jq -r '.project // ""' 2>/dev/null || true)"
	error="$(printf '%s' "$item" | jq -r '.error // ""' 2>/dev/null || true)"
	screenshot="$(printf '%s' "$item" | jq -r 'first(.attachments[]? | select(.name == "screenshot") | .path) // ""' 2>/dev/null || true)"
	trace="$(printf '%s' "$item" | jq -r 'first(.attachments[]? | select(.name == "trace") | .path) // ""' 2>/dev/null || true)"

	if [ "$kind" = "flaky" ]; then
		heading="${title} — flaky (passed on retry)"
	else
		heading="${title}"
	fi
	dossier="$dossier

## ${heading}
- spec: ${file}:${line}
- project: ${project}
- repro: npx playwright test --project=${project} ${file} -g \"${title}\""
	[ -n "$screenshot" ] && dossier="$dossier
- screenshot: ${screenshot}"
	[ -n "$trace" ] && dossier="$dossier
- trace: npx playwright show-trace ${trace}"
	if [ -n "$error" ]; then
		dossier="$dossier

error:
${error}"
	fi

	console="$(attachment_text "$item" console)"
	if [ -n "$console" ]; then
		dossier="$dossier

console:
${console}"
	fi
	network="$(attachment_text "$item" network)"
	if [ -n "$network" ]; then
		dossier="$dossier

network:
${network}"
	fi

	i=$((i + 1))
done

# 4. Emit additionalContext (jq -Rs JSON-encodes the whole dossier safely).
printf '%s' "$dossier" | jq -Rs '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: .
  }
}' 2>/dev/null || true
exit 0
