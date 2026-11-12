---
sidebar_position: 6
title: Component Reference
description: Every generic UI element type, the fields it reads, and the event it emits.
---

# Component Reference

This page lists every generic element type the Griffon renderer supports, the fields each one actually reads, and the event payload interactive elements send to your [interactions](./03-interactions.md). For the manifest structure itself (`[plugin]`, `[store]`, sections, nesting with `children`, `{{store.*}}` binding), see [The UI Manifest & Store](./02-ui-manifest.md).

Fields not listed here are ignored by the renderer. Unknown `type` values render nothing.

## Common fields

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `type` | string | Yes | One of the types below. |
| `id` | string | Yes at section level, optional when nested | Element identifier, also used as the HTML `id`. Griffon refuses to load a manifest if a direct `[[ui.sections.contents]]` entry has no `id`. Give nested elements one too, and keep them unique. |
| `action` | string | No | Action name emitted on user interaction (interactive elements only). Without it, the element emits nothing. |

### Event payloads

When an interactive element emits its `action`, the event object is available in interaction steps as `event.*`. For `input`, `select`, `switch`, `checkbox` and `tabs`, the event contains **all of the element's own fields** (`event.id`, `event.label`, ...) plus the new `value` or `checked`. Each component section below lists what it adds.

### Things to know before you build

:::caution Current renderer limitations
- **Only `text` resolves `{{store.*}}` templates**, and only in its `name`. Every other field (button labels, `progress.value`, `checked`, `value`, ...) is static.
- **Containers do not pass the store to their children.** A templated `text` or a `table` with `from` placed inside a `row`, `column`, `group` or `tabs` renders empty. Keep store-bound elements directly under `[[ui.sections.contents]]`.
- **Initial values are read once.** `value` and `checked` on inputs only set the starting state; they are not kept in sync with the store. Make them match your `[store]` defaults.
:::

## Styling values

### Tones

Only `text` reads `tone`. Other elements ignore it.

| Tone | Effect |
|------|--------|
| `neutral` (default) | Normal foreground colour |
| `info` | Blue |
| `success` | Green |
| `warning` | Amber |
| `danger` | Red |

### Gap scale

Used by `row`, `column` and `group`.

| Value | `none` | `xs` | `sm` | `md` (default) | `lg` | `xl` |
|-------|--------|------|------|----------------|------|------|
| Spacing | 0 | 0.25rem | 0.5rem | 1rem | 1.5rem | 2rem |

Variants differ per component and are documented in each section.

---

## Display elements

### `text`

Static or store-bound text.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `name` | string | Yes | | Text content. Supports `{{store.<path>}}`. If it resolves to an empty string, nothing is shown. |
| `variant` | string | No | `body` | `body`, `title` (large bold), `subtitle` (medium semibold), `caption` (small, muted), `status` (small, medium weight) |
| `tone` | string | No | `neutral` | See [Tones](#tones). |
| `align` | string | No | `left` | `left`, `center`, `right` |

```toml
[[ui.sections.contents]]
type = "text"
id = "quarantine_error_text"
name = "{{store.quarantine_result.error}}"
variant = "caption"
tone = "danger"
```

### `badge`

A small pill label.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `name` | string | Yes | | Badge text (static). |
| `variant` | string | No | `default` | `default` (primary colour), `secondary`, `outline`, `destructive` (red), `success` (green) |

```toml
[[ui.sections.contents]]
type = "badge"
id = "engine_badge"
name = "Engine ready"
variant = "success"
```

### `progress`

A progress bar. The value is static: it cannot be bound to the store.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `value` | number | Yes | | Progress from 0 to 100. |
| `label` | string | No | | Text shown above the bar, on the left. |
| `show_value` | bool | No | `false` | Shows `<value>%` above the bar, on the right. |

```toml
[[ui.sections.contents]]
type = "progress"
id = "setup_progress"
label = "Setup"
value = 60
show_value = true
```

### `card`

A bordered card with a title and an optional description. It does **not** render `children`; use `group` or `column` to hold content.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `name` | string | Yes | | Card title. |
| `description` | string | No | | Muted text under the title. |

```toml
[[ui.sections.contents]]
type = "card"
id = "status_card"
name = "Protection status"
description = "Signatures are loaded from the local database."
```

### `divider`

A horizontal or vertical separator line.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `orientation` | string | No | `horizontal` | `horizontal` or `vertical`. Ignored when `label` is set. |
| `label` | string | No | | Small uppercase text centred in a horizontal line. |

```toml
[[ui.sections.contents]]
type = "divider"
id = "advanced_divider"
label = "Advanced"
```

---

## Interactive elements

### `button`

Emits its `action` on click. While the action's interaction runs (for example a long `execute_function`), the button shows a spinner and ignores further clicks.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `name` | string | Yes | | Button label. |
| `action` | string | No | | Action emitted on click. |
| `variant` | string | No | `primary` | `primary`, `secondary` or `outline`. Any other value looks like `primary`. |
| `size` | string | No | `md` | `sm`, `md`, `lg` |
| `confirmation` | string | No | | If set, clicking opens an "Are you sure?" dialog showing this message (followed by "This action cannot be undone."). The action is emitted only on **Confirm**. |

**Event:** `{ source = <id>, type = "click" }`

```toml
[[ui.sections.contents]]
type = "button"
id = "delete_bt"
name = "Delete selected"
variant = "secondary"
confirmation = "Delete the selected threats? This is irreversible."
action = "scanner.delete_selected_threats"
```

### `input`

A single-line text field. It emits on **every keystroke**.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `label` | string | No | | Label above the field. |
| `placeholder` | string | No | | Placeholder text. |
| `value` | string | No | | Initial value. |
| `input_type` | string | No | `text` | HTML input type: `text`, `number`, `password`, `email`, `search`, `url` |
| `description` | string | No | | Muted helper text below the field. |
| `disabled` | bool | No | `false` | Disables the field. |
| `action` | string | No | | Action emitted on change. |

**Event:** element fields + `value` (string, even with `input_type = "number"`).

```toml
[[ui.sections.contents]]
type = "input"
id = "threads_input"
label = "Thread count"
placeholder = "Enter thread number..."
input_type = "number"
action = "scanner.set_threads"
```

### `select`

A single-choice dropdown.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `options` | array of `{ label, value }` | Yes | | Choices. `value` must be a non-empty string. |
| `value` | string | No | | Initially selected `value`. |
| `label` | string | No | | Label above the dropdown. |
| `placeholder` | string | No | `Select an option` | Shown when nothing is selected. |
| `description` | string | No | | Muted helper text below. |
| `disabled` | bool | No | `false` | Disables the dropdown. |
| `action` | string | No | | Action emitted on change. |

**Event:** element fields + `value` (the chosen option's `value`).

```toml
[[ui.sections.contents]]
type = "select"
id = "threads_select"
label = "Threading"
options = [
    { "value" = "auto", "label" = "Auto" },
    { "value" = "max", "label" = "Max" },
    { "value" = "off", "label" = "Off" },
]
value = "auto"
action = "scanner.set_threading"
```

### `switch`

An on/off toggle in a bordered row, with the label on the left.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `label` | string | Yes | | Label text. |
| `description` | string | No | | Muted helper text under the label. |
| `checked` | bool | No | `false` | Initial state. |
| `disabled` | bool | No | `false` | Disables the switch. |
| `action` | string | No | | Action emitted on toggle. |

**Event:** element fields + `checked` (bool).

```toml
[[ui.sections.contents]]
type = "switch"
id = "dry_run_switch"
label = "Dry run"
description = "List files without deleting them."
checked = true
action = "cleaner.set_dry_run"
```

### `checkbox`

A checkbox with a label.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `label` | string | Yes | | Label text. |
| `description` | string | No | | Muted helper text under the label. |
| `checked` | bool | No | `false` | Initial state. |
| `disabled` | bool | No | `false` | Disables the checkbox. |
| `action` | string | No | | Action emitted on toggle. |

**Event:** element fields + `checked` (bool). Pairs naturally with an `append_remove` step using `from = "event.checked"`.

```toml
[[ui.sections.contents]]
type = "checkbox"
id = "threat_ransomware_cb"
label = "Ransomware"
checked = false
action = "scanner.set_threat_ransomware"
```

### `file_select_button`

Opens the native file or folder picker. Several items can be picked at once.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `name` | string | No | `Select file` | Button label. |
| `accept_directory` | bool | No | `false` | `true` picks folders, `false` picks files. |
| `accept` | string | No | | Comma-separated extension filter for files, e.g. `".toml,.json"` (leading dots optional). |
| `disabled` | bool | No | `false` | Disables the button. |
| `action` | string | No | | Action emitted for each picked path. |

**Event:** emitted **once per picked path**: `{ value = <absolute path>, append = true }`. Use it with `append_remove` and `from = "event.append"` to add paths to a store array.

```toml
[[ui.sections.contents]]
type = "file_select_button"
id = "select_folder_bt"
name = "Select folder"
accept_directory = true
action = "scanner.select_folder"
```

### `file_select`

A read-only text field with a **Browse** button, using the webview's file input. It only returns the **file name, not its path**, so prefer `file_select_button` whenever your backend needs to open the file.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `name` | string | No | | Label above the field. |
| `placeholder` | string | No | `No file selected` | Shown in the field when `bind` resolves to nothing. |
| `button_label` | string | No | `Browse` | Label of the button. |
| `accept` | string | No | | HTML `accept` filter, e.g. `".toml,.json"`. |
| `bind` | string | No | | **Top-level** store key whose value is shown in the field. Dotted paths and the `store.` prefix are not supported. |
| `disabled` | bool | No | `false` | Disables the field and button. |
| `action` | string | No | | Action emitted after a file is picked. |

**Event:** `{ source = <id>, type = "file_select", value = <file name>, name = <file name>, file, files }`

```toml
[[ui.sections.contents]]
type = "file_select"
id = "config_picker"
name = "Configuration file"
button_label = "Browse"
accept = ".toml,.json"
action = "file.selected"
```

### `table`

Renders rows from a store array (or from static `rows`). Every row starts with a selection checkbox; ticking or unticking it emits the `action`.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `columns` | array of column tables | Yes | | Column definitions (see below). |
| `from` | string | No | | Store path of an **array of objects**, e.g. `store.q_list.items`. Takes precedence over `rows`. |
| `rows` | array of tables | No | `[]` | Static rows, used when `from` is not set or resolves to nothing. |
| `action` | string | No | | Action emitted when a row checkbox changes. |

Each column:

| Key | Type | Required | Default | Meaning |
|-----|------|----------|---------|---------|
| `key` | string | Yes | | Field of the row object to display. |
| `label` | string | Yes | | Column header. |
| `hide` | bool | No | `false` | Don't display this column (it can still be transmitted). |
| `transmit` | bool | No | `false` | Include this column's value in the event. |

**Event:** `{ value = [<values of transmit columns, in column order>], checked = <bool> }`. `value` is always an array (empty if no column has `transmit = true`). With exactly one transmit column, `value = "{{event.value}}"` in an `append_remove` step yields that single value as a string.

```toml
[[ui.sections.contents]]
type = "table"
id = "quarantine_table"
from = "store.q_list.quarantined_items"
columns = [
    { "key" = "quarantined_at", "label" = "Quarantined at" },
    { "key" = "original_path", "label" = "Name" },
    { "key" = "quarantine_name", "label" = "File", "hide" = true, "transmit" = true },
]
action = "scanner.quarantine_table_select"
```

### `tabs`

Tabs inside a section, each with its own children. Not to be confused with the plugin-level `[plugin].tabs`.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `tabs` | array of tab tables | Yes | | Tabs, each with `label` (string), `value` (string, unique) and optional `children` (elements). |
| `value` | string | No | first tab's `value` | Initially active tab. |
| `action` | string | No | | Action emitted when the active tab changes. |

**Event:** element fields + `value` (the new tab's `value`).

```toml
[[ui.sections.contents]]
type = "tabs"
id = "threat_views"
value = "active"
action = "threats.view_changed"

[[ui.sections.contents.tabs]]
label = "Active"
value = "active"

[[ui.sections.contents.tabs.children]]
type = "text"
id = "active_hint"
name = "Threats found during the last scan."

[[ui.sections.contents.tabs]]
label = "Resolved"
value = "resolved"
```

---

## Layout elements

All three render their `children` in order and pass actions through. Remember that they do **not** pass the store down (see [limitations](#things-to-know-before-you-build)).

### `row`

Lays children out horizontally.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `children` | array of elements | No | | Child elements. |
| `gap` | string | No | `md` | See [Gap scale](#gap-scale). |
| `align` | string | No | `stretch` | Cross-axis alignment: `start`, `center`, `end`, `stretch` |
| `justify` | string | No | `start` | `start`, `center`, `end`, `space-between`, `space-around`. Other values (e.g. `flex-end`) fall back to `start`. |
| `wrap` | bool | No | `false` | Wrap children onto several lines. |

```toml
[[ui.sections.contents]]
type = "row"
id = "scan_bt_row"
gap = "sm"
align = "center"

[[ui.sections.contents.children]]
type = "button"
id = "run_scan_bt"
name = "Run scan"
action = "scanner.run_scan"
```

### `column`

Lays children out vertically. Same fields as `row` except `wrap`.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `children` | array of elements | No | | Child elements. |
| `gap` | string | No | `md` | See [Gap scale](#gap-scale). |
| `align` | string | No | `stretch` | `start`, `center`, `end`, `stretch` |
| `justify` | string | No | `start` | `start`, `center`, `end`, `space-between`, `space-around` |

```toml
[[ui.sections.contents.children]]
type = "column"
id = "threat_types_column"
gap = "md"

[[ui.sections.contents.children.children]]
type = "text"
id = "threat_types_title"
name = "Threat types"
variant = "subtitle"
```

### `group`

A vertical stack with an optional heading.

| Field | Type | Required | Default | Meaning |
|-------|------|----------|---------|---------|
| `children` | array of elements | No | | Child elements. |
| `title` | string | No | | Heading shown above the children. |
| `description` | string | No | | Muted text under the title. |
| `gap` | string | No | `md` | See [Gap scale](#gap-scale). |

```toml
[[ui.sections.contents]]
type = "group"
id = "scan_options"
title = "Scan options"
description = "Applied to the next scan."
gap = "sm"

[[ui.sections.contents.children]]
type = "checkbox"
id = "archive_cb"
label = "Include archived files"
action = "scanner.set_archive"
```

---

## Plugin-specific types

The renderer also knows a few types prefixed with `scanner_`, `cleaner_` and `nmap_`. They exist only for Griffon's first-party plugins, are being replaced by the generic components above, and **must not be used by new plugins**.

## Conventions

- **Action names:** namespace them by plugin and describe intent, e.g. `scanner.run_scan`, `scanner.set_archive`. Avoid implementation names like `runScanV2`.
- **Ids:** lowercase `snake_case`, unique across the manifest, with a short type suffix for clarity (`run_scan_bt`, `threads_select`, `quarantine_table`).
- **Layout:** `column` for vertical flow, `row` for action bars and inline controls, `group` for a titled block, `divider` to separate blocks.
- **Keep the manifest presentational:** the UI only emits actions and shows store values; all logic belongs in [interactions](./03-interactions.md) and your [Rust backend](./04-rust-backend.md).
