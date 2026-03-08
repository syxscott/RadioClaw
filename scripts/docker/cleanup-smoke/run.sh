#!/usr/bin/env bash
set -euo pipefail

cd /repo

export RadioClaw_STATE_DIR="/tmp/RadioClaw-test"
export RadioClaw_CONFIG_PATH="${RadioClaw_STATE_DIR}/RadioClaw.json"

echo "==> Build"
pnpm build

echo "==> Seed state"
mkdir -p "${RadioClaw_STATE_DIR}/credentials"
mkdir -p "${RadioClaw_STATE_DIR}/agents/main/sessions"
echo '{}' >"${RadioClaw_CONFIG_PATH}"
echo 'creds' >"${RadioClaw_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${RadioClaw_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm RadioClaw reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${RadioClaw_CONFIG_PATH}"
test ! -d "${RadioClaw_STATE_DIR}/credentials"
test ! -d "${RadioClaw_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${RadioClaw_STATE_DIR}/credentials"
echo '{}' >"${RadioClaw_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm RadioClaw uninstall --state --yes --non-interactive

test ! -d "${RadioClaw_STATE_DIR}"

echo "OK"
