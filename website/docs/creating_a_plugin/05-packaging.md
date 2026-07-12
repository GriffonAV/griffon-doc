---
sidebar_position: 5
title: Packaging & Loading
description: Bundling your plugin and loading it into Griffon.
---

# Packaging & Loading

Once your manifest and your Rust library are ready, getting them into Griffon is the easy part.

## 1. Build the library

```bash
cargo build --release
```

This produces your compiled `.so` (e.g. `target/release/libmy_plugin.so`).

## 2. Double-check the manifest and library agree

Before packaging, make sure:

- The `uuid` in `[plugin]` (your `.toml`) matches the `UUID` your library returns from `init()`.
- Every `fn = "..."` used in an `[[interactions.steps]]` block in the manifest is also handled in your library's `handle_message()`, and is listed in the `function` entry returned by `init()`.
- Every `tab` referenced by a `[[ui.sections]]` block exists in `[plugin].tabs`.

Mismatches here won't necessarily fail to load — they tend to fail silently at the point a user clicks the affected button, so it's worth double-checking manually until we have tooling to validate this automatically.

## 3. Zip the two files together

```bash
zip my_plugin.zip libmy_plugin.so my_plugin.toml
```

The archive should contain just these two files — no folders, no extra assets.

## 4. Load it into Griffon

From the Griffon settings menu, load the `.zip` archive. Griffon will:

1. Extract the manifest and build the UI described in `[ui]`, using the tabs and defaults from `[plugin]`/`[store]`.
2. Dynamically load the `.so` and call `init()` to fetch metadata and register available functions.
3. Wire up the `[[interactions]]` so that UI actions call into your library through `handle_message()`.

## Checklist

- [ ] `Cargo.toml` has `crate-type = ["cdylib"]`
- [ ] `init()` returns real metadata, including a `UUID` matching the manifest's `uuid`
- [ ] `init()`'s `function` list matches exactly what `handle_message()` handles
- [ ] `handle_message()` returns valid JSON (or an `ERR ...` string) for every supported function
- [ ] Manifest's `tabs` cover every `tab` used by a section
- [ ] Every `fn = "..."` in an interaction step matches a function your library implements
- [ ] `cargo build --release` succeeds and produces a `.so`
- [ ] `.so` and `.toml` zipped together with no extra files
- [ ] Plugin loads in Griffon, all tabs render, and at least one function call round-trips correctly

That's the full loop — manifest to UI, UI actions to interactions, interactions to your Rust functions, and results back into the store to refresh the UI. As mentioned in the [overview](./01-overview.md), tooling to reduce or generate the manifest automatically is planned but not available yet, so this manual workflow is the current path for building a plugin.