---
sidebar_position: 4
title: The Rust Backend
description: Implementing the .so library that powers your plugin's logic.
---

# The Rust Backend

The Rust half of your plugin is a **dynamic library** (`cdylib`) that exposes a stable ABI via [`abi_stable`](https://docs.rs/abi_stable). At runtime, Griffon loads the `.so` and interacts with it through exactly two exported functions:

- **`init()`** → returns plugin metadata (name, author, description, the list of callable functions...)
- **`handle_message(msg)`** → receives a command, dispatches it, and returns a JSON string response

Everything your plugin *does* lives behind `handle_message`. The manifest never talks to your code directly — it only ever sends `"fn:<name> <json-payload>"` strings and stores whatever JSON comes back.

## 1. Cargo setup

Your plugin must be compiled as a dynamic library:

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
plugin_interface = { workspace = true }
abi_stable = { workspace = true }
serde = { version = "1", features = ["derive"] }
serde_json = "1.0"
```

`plugin_interface` and `abi_stable` are required — they define the ABI contract between the host and every plugin, and must stay unchanged. You only *implement* the two functions; you never modify the interface types themselves.

:::warning ABI-safe types only
Anything crossing the plugin boundary (arguments and return values of `init`/`handle_message`) must use `abi_stable` types — `RString`, `RVec`, `RResult`, etc. — not plain `String`/`Vec`/`Result`. Inside your own functions you're free to use normal Rust types; you just need to convert at the boundary.
:::

## 2. `init()` — report your plugin's identity and functions

`init()` is called once when Griffon loads the plugin. Use it to:

- Return metadata for the plugin card in the UI (name, author, description, a unique id).
- Report the list of function names your plugin supports — these are exactly the names your manifest's `fn = "..."` steps will reference.
- Optionally kick off one-time setup (e.g. spawning a background thread to warm up an engine).

```rust
use abi_stable::std_types::{RResult, RString, RVec, Tuple2};
use abi_stable::sabi_extern_fn;

#[sabi_extern_fn]
pub extern "C" fn init() -> RResult<RVec<Tuple2<RString, RString>>, RString> {
    let mut info = RVec::new();

    info.push(Tuple2(RString::from("name"), RString::from("My Plugin")));
    info.push(Tuple2(RString::from("author"), RString::from("Developer")));
    info.push(Tuple2(RString::from("description"), RString::from("Custom logic")));
    info.push(Tuple2(RString::from("UUID"), RString::from("<same uuid as in your .toml>")));

    // One "function" entry, functions separated by "/"
    info.push(Tuple2(
        RString::from("function"),
        RString::from("check/scan/quarantine/delete"),
    ));

    RResult::ROk(info)
}
```

:::warning `init()` state doesn't persist
Don't assume anything created inside `init()` is still around later in `handle_message()` — each exported function call is independent, and local variables from `init()` are dropped when it returns. If you need shared state (a loaded engine, a running scan, a background flag), store it in a persistent structure: a `static`/`lazy_static`/`OnceLock`, protected by a `Mutex`/`RwLock` or an atomic.
:::

## 3. `handle_message()` — dispatch and respond

`handle_message` receives a single string in the form `"fn:<name> <json-payload>"` (the payload is optional) and must return a JSON string response.

A clean way to structure this is a small **command registry**: a map from function name to a typed handler, so the boilerplate of parsing JSON in and serializing JSON out lives in one place, and each entry is just business logic.

```rust
use std::collections::HashMap;
use std::sync::OnceLock;
use serde::{Deserialize, Serialize};
use abi_stable::std_types::RString;

type Handler = Box<dyn Fn(serde_json::Value) -> RString + Send + Sync>;

/// Wraps a typed `(input) -> Result<output, String>` function into a Handler
/// that (de)serializes JSON automatically.
fn command<I, O, F>(f: F) -> Handler
where
    I: serde::de::DeserializeOwned,
    O: Serialize,
    F: Fn(I) -> Result<O, String> + Send + Sync + 'static,
{
    Box::new(move |payload: serde_json::Value| -> RString {
        let input: I = match serde_json::from_value(payload) {
            Ok(v) => v,
            Err(e) => return RString::from(
                serde_json::json!({ "message": format!("invalid arguments: {e}") }).to_string()
            ),
        };
        match f(input) {
            Ok(output) => RString::from(serde_json::to_string(&output).unwrap_or_default()),
            Err(e) => RString::from(serde_json::json!({ "message": e }).to_string()),
        }
    })
}

#[derive(Deserialize, Default)]
struct NoArgs {}

#[derive(Serialize)]
struct Ack { ok: bool, message: String }

fn registry() -> &'static HashMap<&'static str, Handler> {
    static REGISTRY: OnceLock<HashMap<&'static str, Handler>> = OnceLock::new();
    REGISTRY.get_or_init(|| {
        let mut m: HashMap<&'static str, Handler> = HashMap::new();

        m.insert("check", command(|_: NoArgs| -> Result<Ack, String> {
            Ok(Ack { ok: true, message: "ready".into() })
        }));

        // one entry per function reported in init()
        m
    })
}

fn split_message(raw: &str) -> (&str, &str) {
    let raw = raw.trim();
    let (head, rest) = match raw.split_once(char::is_whitespace) {
        Some((h, r)) => (h, r.trim()),
        None => (raw, ""),
    };
    (head.strip_prefix("fn:").unwrap_or(head), rest)
}

fn parse_payload(raw_payload: &str) -> Result<serde_json::Value, String> {
    if raw_payload.is_empty() { return Ok(serde_json::Value::Null); }
    serde_json::from_str(raw_payload).map_err(|e| format!("invalid payload json: {e}"))
}

#[abi_stable::sabi_extern_fn]
extern "C" fn handle_message(msg: RString) -> RString {
    let raw = msg.as_str().trim();
    let (function, raw_payload) = split_message(raw);

    let payload = match parse_payload(raw_payload) {
        Ok(v) => v,
        Err(_) => return RString::from(format!("ERR invalid payload json: {raw_payload}")),
    };

    match registry().get(function) {
        Some(handler) => handler(payload),
        None => RString::from(format!("ERR unknown function: {function}")),
    }
}
```

With this pattern, adding a new function your manifest can call is just one new `m.insert(...)` entry with its own typed input/output structs — no changes to the dispatch logic.

A couple of conventions worth following:

- Deserialize the payload into a small `struct` per function (with `#[serde(default)]` on optional fields) rather than working with raw `serde_json::Value` everywhere — it keeps each handler self-documenting.
- On error, return a JSON object with a `message` field (or an `ERR ...` string) rather than panicking — panicking across the ABI boundary is undefined behavior and can crash the host.
- If a function needs no arguments, accept a small empty struct (like `NoArgs` above) so it still deserializes cleanly from `null`, `{}`, or a missing payload.

## 4. Exporting the module

Finally, expose your function pointers to the host loader:

```rust
use abi_stable::export_root_module;
use plugin_interface::{PluginI, PluginRoot, PluginRoot_Ref};

#[export_root_module]
pub fn get_library() -> PluginRoot_Ref {
    PluginRoot {
        plugin: PluginI {
            init,
            handle_message,
        }
        .leak_into_prefix(),
    }
    .leak_into_prefix()
}
```

## Managing state across calls

Most plugins fall into one of two shapes:

- **Stateless** — everything needed is in the payload, compute and return directly in the handler. No globals needed.
- **Stateful / background** — something needs to persist across calls (a loaded engine, an in-progress scan, a running watcher). Use a global `static` protected by a `Mutex`/`OnceLock`/atomic, and keep `handle_message()` fast: for long-running work, spawn a thread and let the plugin poll/report status through a separate function rather than blocking the call.

## Common mistakes to avoid

- Using `String`/`Vec`/`Result` directly across the ABI boundary — always convert to `RString`/`RVec`/`RResult` at `init`/`handle_message`.
- Forgetting `crate-type = ["cdylib"]` — without it, no `.so` is produced.
- Panicking inside `init()` or `handle_message()` — return an error value instead.
- Reporting a function name in `init()` that isn't handled in `handle_message()` (or vice versa) — the manifest's `fn = "..."` will silently fail to find a match.
- Changing the `PluginI`/`PluginRoot` interface types — you implement them, you don't modify them.

Next: **[Packaging & Loading](./05-packaging.md)** — turning your `.so` and `.toml` into an installable plugin.