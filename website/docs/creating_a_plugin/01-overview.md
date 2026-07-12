---
sidebar_position: 1
title: Plugin Architecture
description: How Griffon plugins are structured, and what you need to build one.
---

# Building a Griffon Plugin

Welcome to the Griffon plugin developer documentation! This section will walk you through everything you need to build, package, and load your own plugin.

## The two-file model

A Griffon plugin is made of exactly **two files**:

| File | Role |
|------|------|
| **`.so`** (dynamic library) | A Rust `cdylib` that implements your plugin's logic. It exposes a small, stable interface that Griffon calls into. |
| **`.toml`** (manifest) | A configuration file that tells Griffon what UI to render, what data to keep track of, and which Rust function to call for each user interaction. |

To install a plugin, you **zip these two files together** and load the archive from the Griffon settings menu. There is no separate installer, build step on the host side, or registration process — Griffon reads the manifest, builds the UI from it, and dynamically loads the library.

:::info Future tooling
Writing the `.toml` manifest by hand is currently the most time-consuming part of building a plugin. We are actively working on tooling that will let most of this configuration be generated directly from your Rust library, so that in the future you'll only need to write a minimal manifest — or none at all. That tooling doesn't exist yet, so for now the manifest has to be written manually. This guide covers the manual process as it stands today.
:::

## The Griffon mental model

Regardless of what your plugin does, every interaction with it follows the same loop:

1. **User action** — the user clicks a button, checks a box, types into a field, etc.
2. **Action emitted** — the UI element emits a named action string (e.g. `scanner.run_scan`).
3. **Interaction executes** — Griffon looks up the interaction bound to that action and runs its steps in order.
4. **Store updated or function called** — steps either mutate the store directly, or call into your `.so` via `handle_message`, storing the JSON response back into the store.
5. **UI refreshes** — any UI element bound to a store value that changed automatically re-renders.

Understanding this loop is the key to understanding how a Griffon plugin works: **the `.toml` manifest owns the UI and the wiring, and the Rust library owns the actual logic.** Your Rust code never talks to the UI directly — it only ever receives a JSON message and returns a JSON response.

## What each file is responsible for

- **`[plugin]`** in the manifest — plugin identity: name, id/uuid, version, author, description, and the tabs your plugin exposes.
- **`[store]`** in the manifest — the plugin's local state: default settings, results, selections, error/status messages. This is the single source of truth the UI reads from.
- **`[ui]`** in the manifest — the actual layout: sections, tabs, and nested UI elements (buttons, checkboxes, tables, inputs, etc.), each optionally bound to the store and/or emitting an action.
- **`[[interactions]]`** in the manifest — the glue: for each action emitted by the UI, a list of steps to run (update the store, call a Rust function, log a value, ...).
- **The Rust library (`.so`)** — implements `init()` (returns plugin metadata + the list of callable functions) and `handle_message()` (a single entry point that receives `"fn:<name> <json>"` and dispatches to the right handler, returning JSON).

The next pages go through each piece in detail:

- **[The UI Manifest & Store](./02-ui-manifest.md)** — how to declare state and lay out your UI.
- **[Interactions](/docs/creating_a_plugin/03-interactions.md)** — how to wire UI actions to store updates and Rust function calls.
- **[The Rust Backend](./04-rust-backend.md)** — how to implement `init()` and `handle_message()`.
- **[Packaging & Loading](./05-packaging.md)** — how to zip everything up and load it into Griffon.