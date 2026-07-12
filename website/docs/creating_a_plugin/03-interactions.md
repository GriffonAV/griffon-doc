---
sidebar_position: 3
title: Interactions
description: Wiring UI actions to store updates and Rust function calls.
---

# Interactions

Interactions are the glue between your UI and your store/backend. Every interactive element (`button`, `checkbox`, `select`, `input`, `table`, `file_select_button`, ...) emits a named **action** when the user interacts with it. An `[[interactions]]` block listens for that action and runs a list of **steps** in order.

```toml
[[interactions]]
id = "load_data"
on = "app.refresh"          # matches the action emitted by a UI element

[[interactions.steps]]
type = "execute_function"
fn = "my_rust_function"
key = "store.data.results"
returnType = "json"
```

- `on` must match the `action` string set on the UI element that triggers this interaction.
- `steps` run in order, top to bottom. An interaction can have as many steps as it needs.

## Step types

### `set`

Writes a value directly into the store, usually from the triggering event.

```toml
[[interactions]]
id = "set_archive_scan"
on = "scanner.set_archive"

[[interactions.steps]]
type = "set"
key = "store.settings.archive"
from = "event.checked"
```

### `append_remove`

Adds or removes a value from an array in the store, depending on the event — the classic pattern for checkboxes and multi-select tables (add when checked/selected, remove when unchecked/deselected).

```toml
[[interactions]]
id = "set_threat_ransomware"
on = "scanner.set_threat_ransomware"

[[interactions.steps]]
type = "append_remove"
key = "store.settings.threats"
from = "event.checked"
value = "ransomware"
```

This is also how you build "add to list" UI, like a file picker feeding a list of scan targets:

```toml
[[interactions.steps]]
type = "append_remove"
key = "store.settings.paths"
value = "{{event.value}}"
from = "event.append"
```

### `execute_function`

Calls into your Rust backend via `handle_message`, and stores the (JSON) response back into the store.

```toml
[[interactions]]
id = "run_scan"
on = "scanner.run_scan"

[[interactions.steps]]
type = "execute_function"
key = "store.data.scan_result"      # where the response is written
from = "store.settings"              # store value sent as the JSON payload
fn = "scan"                          # must match a function name your library registers
```

- `fn` is the function name — this must be one of the functions your Rust library's `init()` reports as available (see the [Rust Backend](./04-rust-backend.md) page), and must be handled inside `handle_message()`.
- `from` (optional) is the store path whose value is serialized to JSON and sent as the payload. If omitted, no payload is sent.
- `key` is where the JSON response is written back into the store.
- `returnType = "json"` tells Griffon to parse the response as JSON before storing it (rather than storing the raw string).

### `log`

Writes a store value to the Griffon console — useful for debugging while you build your manifest, not meant to stay long-term in a shipped plugin.

```toml
[[interactions.steps]]
type = "log"
key = "store.settings.paths"
```

## Event bindings reference

The `from` field on `set` / `append_remove` steps refers to the payload of the triggering event:

| Binding | Set by |
|---------|--------|
| `event.checked` | `checkbox` elements |
| `event.value` | `select` / `input` elements, or a `{{event.value}}` picked value |
| `event.append` | `file_select_button` (signals "add this value") |

## Chaining steps

An interaction can chain multiple steps, for example calling a function and then immediately refreshing a list that depends on its result:

```toml
[[interactions]]
id = "quarantine_selected_threats"
on = "scanner.quarantine_selected_threats"

[[interactions.steps]]
type = "execute_function"
key = "store.quarantine_result"
from = "store.selected_threats"
returnType = "json"
fn = "quarantine"

[[interactions.steps]]
type = "execute_function"
key = "store.q_list"
returnType = "json"
fn = "q_list"
```

Here, quarantining the selected threats immediately re-fetches the quarantine list, so the table updates without a separate manual refresh.

Next: **[The Rust Backend](./04-rust-backend.md)** — implementing the functions your interactions call into.