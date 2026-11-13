---
sidebar_position: 4
title: Testing
description: How Griffon is tested, how to run the tests, and the rules every change must follow.
---

# Testing

## Rules

- **Tests run offline.** No network, no root, no real `nmap`, `curl` or Docker daemon. Anything that really needs the network is marked `#[ignore = "requires network access"]`.
- **Tests run in parallel.** Never change the global `HOME`, `PATH` or current directory of the test process. Use a `tempfile::TempDir` for every file a test creates.
- **Every plugin has three layers of tests:**
  1. **Unit tests** in `src/`, which cover the plugin's own logic.
  2. **Integration tests** in `tests/integration_tests.rs`, which cover the full request path inside the plugin.
  3. **Contract tests** in `daemon/plugin_host/tests/plugin_contract.rs`, which check that the `.so` loads, that its metadata matches its manifest, and that it answers calls.
- **Protocol changes** (IPC, plugin ABI, manifest) come with round-trip or contract tests, written *before* the change.
- **Coverage:** at least **70% of executable lines, per plugin** (see [Coverage](#coverage)).

## Running the tests

From the repository root, on Linux:

```sh
# Scanner fixtures (needed once, before running the workspace tests)
(cd plugins/griffon_scanner && python3 tests/fixtures/fetch_eicar.py && python3 tests/fixtures/generate_fixtures.py)

# Everything except the contract tests, as the CI "Tests" job does
cargo nextest run --workspace --locked -E 'not binary_id(plugin_host::plugin_contract)'

# Contract tests for all plugins, as the CI "Plugin Contract" job does
cargo nextest run -p plugin_host --locked -E 'binary_id(plugin_host::plugin_contract)'

# One plugin: unit + integration tests
cargo test --locked -p griffon_cleaner --all-targets

# Only the integration tests of a plugin
cargo test --locked -p griffon_nmap --test integration_tests

# Lints, as CI does
cargo clippy --locked --workspace --all-targets -- -D warnings
cargo fmt --all --check
```

`cargo test` works too if you don't have [`cargo-nextest`](https://nexte.st) installed.

## Unit tests

Unit tests live next to the code (`tests.rs`, `*_tests.rs` or `#[cfg(test)]` modules) and cover a plugin's logic: parsing, validation, edge cases and hostile input.

To keep them offline and deterministic, small internal helpers take their dependencies as parameters: a command runner, a history file path, a list of cache roots. Production code passes the real `Command::output` and the real paths. Tests pass fakes and temporary directories. The public functions and the plugin ABI do not change.

## Integration tests

Integration tests live in `tests/integration_tests.rs` of each plugin crate. They go through the real exported entry point (`get_library`), the SDK router and the plugin logic, as the daemon would. The plugin's external tools are replaced by fixtures. For example, a fake `nmap`, `docker` or `curl` shell script records its arguments and returns fixed output.

### The isolation pattern

Some plugins read `HOME`, `PATH` or relative paths. Changing those in the test process would break parallel tests, so each scenario does the following:

1. It creates a `TempDir` with the fixtures (fake executables, config, cache tree).
2. It **re-launches the test binary as a child process**, with `HOME`, `PATH` and the current directory pointing at the fixtures. Only the child gets this environment.
3. The child runs the scenario and the parent checks the result. Each scenario has a timeout (20 s), and the child's logs are printed when it fails.

The child's entry point is a test called `isolated_session`, marked `#[ignore]`. **It is not a skipped scenario**, which is why it shows up as "ignored" in every run. Don't run it with `--ignored`: it needs the environment its parent prepares.

The suites **refuse to run in a release build**: the Cleaner config and the Nmap history use relative paths only in debug builds. In release they would touch the real system paths.

### Limits

These suites don't load the `.so` dynamically. They also don't start the daemon or the GUI, and they don't run a real `nmap` or Docker. That is the job of the contract tests, and of future functional and end-to-end suites.

:::warning Cleaner and the host machine
`ExecutionContext.root_paths` does **not** isolate the cleaning of known cache locations. Never rely on it alone to protect the host in a test. Use a temporary `HOME` (as the integration suite does), a container or a VM.
:::

## Coverage

```sh
rustup component add llvm-tools-preview
cargo install cargo-llvm-cov --version 0.9.1 --locked
bash scripts/plugin-coverage.sh
```

This produces `target/plugin-coverage/coverage.json` (used to check the thresholds) and `target/plugin-coverage/html/index.html` (to browse the uncovered lines: `xdg-open target/plugin-coverage/html/index.html`). The CI `plugin-coverage` job uploads both. If you download the HTML report from CI, extract the whole archive so the links between pages keep working.

How the score is computed:

- CI enforces it today for **Cleaner and Nmap** (the `plugin-coverage` job). New plugins should be added to `scripts/plugin-coverage.sh`.
- The threshold is **70% of executable lines, separately for each plugin**. The score is total covered lines divided by total measured lines. It is not an average of per-file percentages.
- The script runs with `--all-targets`, so both unit and integration tests count.
- Every production file under `plugins/<plugin>/src/` counts, including entry points and inactive modules. Only test files (`tests.rs`, `*_tests.rs`) are excluded. Shared crates don't count towards a plugin's score.
- No business code is excluded from the measurement.

Line coverage doesn't measure branches or concurrency, so a high score doesn't replace good scenarios.

## Packages

Package installation is tested separately: see [Testing the packages](./packaging_testing.md).
