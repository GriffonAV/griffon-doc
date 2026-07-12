---
sidebar_position: 2
title: The UI Manifest & Store
description: Declaring plugin metadata, state, and layout in the .toml manifest.
---

# The UI Manifest & Store

The `.toml` manifest is where you declare **who your plugin is**, **what state it keeps**, and **what it looks like**. It is read by Griffon at load time to build the UI — you don't write any UI code yourself.

A manifest has four top-level blocks, always in this rough order:

```toml
[plugin]        # identity
[store]         # state
[ui]            # layout
[[interactions]] # wiring (covered in the next page)
```

## 1. `[plugin]` — identity

Every manifest starts with a `[plugin]` block:

```toml
[plugin]
name = "My Security Tool"
id = "org.example.mytool"
version = "1.0.0"
author = "Developer"
description = "A custom analysis plugin"
tabs = ["main"]
uuid = "123e4567-e89b-12d3-a456-426614174000"
```

- `tabs` lists the top-level tabs your plugin will expose. You'll reference these names later when placing UI sections. Don't hesitate to use several tabs to separate distinct features (for example a scanner plugin might use `["scan", "database", "quarantine"]`).
- `uuid` should be a unique identifier for the plugin and should match what your Rust library reports in `init()` (see the [Rust Backend](./04-rust-backend.md) page) — Griffon uses this to associate the manifest with the correct library.

## 2. `[store]` — plugin state

The store holds all the mutable data your plugin's UI reads from and writes to. Think of it as the single source of truth: UI elements read values from it, interactions write values into it, and any UI element bound to a value that changes will automatically refresh.

You declare the store as nested tables, and simply assign default values:

```toml
[store.settings]
folder = false
archive = false
threats = []
threads = "1"
threading = "auto"
paths = []

[store.data]
scan_result = ""

[store.selected_threats]
paths = []
```

There's no fixed schema — you design the shape of your store around what your plugin needs to track: current settings, the last result returned by a function call, the user's current selection, status/error messages, and so on. A common pattern is to keep a `*_result` or `*_status` object per feature, with a `message` and `error` field, so you can display success/error feedback in the UI:

```toml
[store.data.database_status]
message = "status unknown"
error = ""
rules_count = 0
```

Any value in the store can later be referenced from the UI using the `store.<path>` syntax (see below), or from an interaction step.

## 3. `[ui]` — layout

The UI is a tree of **sections**, each one attached to a tab, containing a tree of **content elements** which can themselves nest children.

### Sections

```toml
[[ui.sections]]
id = "parameters"
tab = "scan"
```

A section is just a container tied to one of the tabs declared in `[plugin].tabs`. You can declare as many sections per tab as you like — they typically stack vertically.

### Content elements

Elements are added under a section (or under another element) with `[[ui.sections.contents]]`, or `[[...contents.children]]` for nested elements. Layout elements (`row`, `column`) are used purely for arrangement; everything else is either a display element or an interactive one.

```toml
[[ui.sections.contents]]
type = "row"
id = "scan_parameters_row"
gap = "lg"

[[ui.sections.contents.children]]
type = "column"
id = "threats_type_column"
gap = "md"

[[ui.sections.contents.children.children]]
type = "text"
id = "threats_type_title"
name = "Threats types"
variant = "subtitle"
```

Nesting follows the tree literally: a `children` array under an element becomes that element's children, and can itself be nested arbitrarily deep (`children.children`, `children.children.children`, ...).

### Known element types

| Type | Purpose |
|------|---------|
| `row`, `column` | Layout containers (`gap`, `align`, `justify` control spacing) |
| `text` | Static or bound label (`variant`, `tone` for styling) |
| `button` | Emits an action on click (`confirmation` shows a confirmation dialog first) |
| `checkbox` | Emits an action with `event.checked` on toggle |
| `select` | Dropdown; emits an action with `event.value` |
| `input` | Free text/number field; emits an action with `event.value` |
| `file_select_button` | Opens a native file/folder picker (`accept_directory` toggles file vs folder) |
| `table` | Renders rows from a store array (`from`, `columns`) and emits an action on row selection |

Some plugins define their own richer, plugin-specific widgets (for example a table with built-in severity styling) — these behave like `table` but are tailored to that plugin's data shape. Stick to the generic types above unless you have a specific need.

### Binding to the store

Any `name` (or similar text field) can interpolate a store value with `{{store.<path>}}`:

```toml
[[ui.sections.contents]]
type = "text"
id = "database_status_text"
name = "{{store.data.database_status.message}}"
```

Tables read their rows from an array in the store via `from`:

```toml
[[ui.sections.contents]]
type = "table"
id = "quarantine_table"
from = "store.q_list.quarantined_items"
columns = [
    { "key" = "quarantined_at", "label" = "Quarantined at" },
    { "key" = "original_path", "label" = "Name" },
]
action = "scanner.quarantine_table_select"
```

Whenever the referenced store value changes (typically as the result of an interaction — see the next page), any element bound to it re-renders automatically. You don't write any refresh logic yourself.

Next: **[Interactions](/docs/creating_a_plugin/03-interactions.md)** — how UI actions actually update the store or call into your Rust backend.