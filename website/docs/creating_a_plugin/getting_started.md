---
sidebar_position: 1
title: Getting Started
description: Build the front of your first plugin.
---

# Getting Started

This tutorial introduces the core concepts behind Griffon plugins.

By the end of this guide you will understand:

- How a plugin UI is declared
- How data is stored
- How interactions work
- How plugin functions are executed
- How information flows through the Griffon runtime

This document intentionally focuses on concepts rather than exhaustive configuration options.

Detailed references for components, interactions, and data binding are covered in separate documents.

---

# The Griffon Mental Model

A Griffon plugin is defined through a single TOML manifest.

The manifest contains four major parts:

```toml
[plugin]

[store]

[ui]

[[interactions]]
```

Each section has a specific responsibility:

| Section | Responsibility |
|----------|---------------|
| `[plugin]` | Plugin metadata |
| `[store]` | Application state |
| `[ui]` | User interface |
| `[[interactions]]` | Application behavior |

A Griffon plugin follows a predictable execution model:

```text
User Action
    ↓
Action Emitted
    ↓
Interaction Executes
    ↓
Store Updated or Function Called
    ↓
UI Refreshes
```

Understanding this flow is the key to understanding Griffon.

---

# Part 1 — Building a UI

## Your First Plugin

Every plugin begins with metadata.

```toml
[plugin]
name = "Hello World"
id = "org.example.hello"
version = "1.0.0"
author = "Developer"
description = "My first Griffon plugin"
tabs = ["main"]
uuid = "123e4567-e89b-12d3-a456-426614174000"
```

The id and uuid are work in progress, leave them empty for now.

Tabs are used to separate the different features of your plugin, do not be afraid to use multiple of them.

---

## Creating a Section

UI elements are organized into sections.

A section belongs to a tab.

```toml
[[ui.sections]]
id = "main_section"
tab = "main"
```

You can think of a section as a container that groups related UI elements.

---

## Adding Content

Elements are added using:

```toml
[[ui.sections.contents]]
```

For example:

```toml
[[ui.sections.contents]]
type = "text"
name = "Hello Griffon"
```

This creates a simple text element.

---

## Adding a Button

Interactive components emit actions.

```toml
[[ui.sections.contents]]
type = "button"
id = "refresh_button"
name = "Refresh"
action = "app.refresh"
```

At this stage the button does not perform any behavior.

It simply emits the action:

```text
app.refresh
```

Actions are just event identifiers.

The behavior will be defined later through interactions.

---

## Building Layouts

Complex interfaces are built using containers.

A row arranges elements horizontally.

```toml
[[ui.sections.contents]]
type = "row"

[[ui.sections.contents.children]]
type = "text"
name = "Dashboard"

[[ui.sections.contents.children]]
type = "button"
name = "Refresh"
action = "app.refresh"
```

Other common layout containers include:

- row
- column
- group
- card

Containers can be nested to build more complex interfaces.

---

## What You Learned

The UI layer is responsible for:

- Displaying information
- Collecting user input
- Emitting actions

The UI does not contain business logic.

Behavior is defined through interactions.

---

# Part 2 — Adding State and Interactions

## Introducing the Store

The store contains all mutable plugin data.

A simple counter might look like this:

```toml
[store.data]
counter = 0
```

The store becomes the source of truth for the application.

---

## Connecting UI to Data

Components can read data from the store.

```toml
[[ui.sections.contents]]
type = "counter_display"
from = "store.data.counter"
```

Whenever the value changes, the component automatically receives the updated data.

---

## Defining Behavior

Behavior is implemented through interactions.

Suppose a button emits:

```text
counter.increment
```

We can react to that action using:

```toml
[[interactions]]
id = "increment_counter"
on = "counter.increment"
```

This tells Griffon:

> When the action `counter.increment` is emitted, execute this interaction.

---

## Updating Store Values

Interactions are composed of steps.

```toml
[[interactions.steps]]
type = "increment"
key = "store.data.counter"
amount = 1
```

When executed:

```text
0 → 1
1 → 2
2 → 3
```

The store value changes automatically.

:::info  
`type` tell griffon what action should be used you can find a list of possible interaction type in [Interactions Reference](./interactions_references.md), here `increment` makes the value referenced in the store go up by `amount`.
:::


---

## The Complete Flow

Button:

```toml
action = "counter.increment"
```

Interaction:

```toml
[[interactions]]
on = "counter.increment"

[[interactions.steps]]
type = "increment"
key = "store.data.counter"
amount = 1
```

Execution:

```text
User clicks button
        ↓
counter.increment emitted
        ↓
Interaction found
        ↓
Store updated
        ↓
UI refreshes
```

No custom frontend code is required.

---

## Why Interactions Exist

Interactions create a clean separation between:

- UI definition
- State management
- Business logic

A component emits an action.

An interaction decides what should happen.

This makes behavior easy to follow and easy to modify.

---

# Part 3 — Calling Plugin Functions

At some point you will want the user to interact with custom functions you made in your plugin.

---

## Executing a Function

A plugin function can be called through the `execute_function` step.

```toml
[[interactions.steps]]
type = "execute_function"
fn = "list_candidates"
```

When this step executes, Griffon calls:

```text
list_candidates()
```

inside the plugin backend.

---

## Storing Results

Function results can be written directly into the store.

```toml
[[interactions.steps]]
type = "execute_function"
fn = "list_candidates"
key = "store.data.candidates"
```

The returned value is automatically stored at:

```text
store.data.candidates
```

---

## Complete Example

Button:

```toml
[[ui.sections.contents]]
type = "button"
name = "Load Candidates"
action = "cleaner.load_candidates"
```

Interaction:

```toml
[[interactions]]
id = "load_candidates"
on = "cleaner.load_candidates"

[[interactions.steps]]
type = "execute_function"
fn = "list_candidates"
key = "store.data.candidates"
```

Execution:

```text
User clicks button
        ↓
Action emitted
        ↓
Interaction executes
        ↓
Plugin function called
        ↓
Result stored
        ↓
UI refreshes
```

This is the standard pattern used by most Griffon plugins.

---

# Complete Example

The following example combines everything introduced in this guide.

```toml
[plugin]
name = "Counter"
id = "org.example.counter"
version = "1.0.0"
author = "Developer"
tabs = ["main"]
uuid = "123e4567-e89b-12d3-a456-426614174000"

[store.data]
counter = 0

[[ui.sections]]
id = "main"
tab = "main"

[[ui.sections.contents]]
type = "button"
id = "increment_button"
name = "Increment"
action = "counter.increment"

[[interactions]]
id = "increment_counter"
on = "counter.increment"

[[interactions.steps]]
type = "increment"
key = "store.data.counter"
amount = 1
```

Even though this plugin is simple, it demonstrates the complete Griffon architecture.

---

# Next Steps

Now that you understand the core workflow, continue with the reference documentation:

- UI Components Reference
- Interactions Reference
- Data Binding Reference
- Plugin Functions Reference
- Custom Components Guide

Those documents provide detailed explanations of the individual systems introduced in this tutorial.
