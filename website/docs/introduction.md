---
sidebar_position: 1
title: Introduction
description: Welcome to the Griffon AV documentation.
---

# Welcome to Griffon

**Griffon** is a fast, modular, and memory-safe security toolkit for Linux, written entirely in Rust. 

Rather than building a monolithic, heavy application, we designed Griffon as a lightweight background daemon that runs custom security plugins. You write the logic, and the system handles the rest.

:::note 🎓 The Griffon Story
We are a team of four students deeply passionate about Rust and the Linux ecosystem. Griffon isn't just a tool; it's our journey to understand system architecture, supply chain security, and native UI integration. It's far from perfect, but we are building it entirely in the open. We welcome all feedback, code reviews, and contributions!
:::

## What's included?

Out of the box, Griffon ships with two primary native plugins:

1. **Malware Scanner:** A high-speed, on-demand antivirus scanner powered by the industry-standard **YARA-X** engine. It uses smart pre-scan filtering to traverse directories instantly without crashing your RAM.
2. **System Cleaner:** A targeted utility to safely wipe unnecessary cache, temporary files, and system junk.

## How it works

Griffon's architecture is split into three main layers:

* **The Daemon:** The core Rust engine that runs in the background. It manages memory, loads heavy datasets (like YARA rules) once, and waits for instructions.
* **The Plugin System:** Security features are loaded dynamically via our `abi_stable` plugin system.
* **The Auto-GUI:** A frontend (built with tauri + nextjs and shadcn/ui) that communicates with the daemon via local JSON messages.

:::tip Transparent Research
Want to know *why* we built it this way? Check out our [Public Notion Board](https://blue-touch-18c.notion.site/Griffon-AV-1c6f05587c8380eb9fbeea36f549fd47?pvs=74) for our threat modeling, architecture decisions, and development logs.
:::

---

Ready to try it out? Head over to the **[Installation Guide](./installation.md)**.