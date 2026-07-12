---
sidebar_position: 2
title: Installation & Releases
description: Download the packages or build Griffon AV from source.
---

# Installation & Releases

You can download the pre-compiled packages directly from our GitHub repository or build the project yourself from the source code.

## Available Releases

Download the latest packages directly from our [GitHub Releases page](https://github.com/GriffonAV/Griffon/releases).

| Version | Status | Description |
| :--- | :--- | :--- |
| **v0.3 (Latest)** | Beta | Modular daemon, auto-generated GUI, Malware Scanner & System Cleaner plugins. |
| **v0.2-alpha** | Beta | Initial proof-of-concept with monolithic design. |

---

## Compile from Source

If you prefer to build the project yourself or want to contribute, you can easily clone the repository and run it using `just`.

### Prerequisites
Make sure you have the following dependencies installed on your system:
* **Rust & Cargo**
* **Node.js & npm**
* **just** (Command runner)

You also need those dependencies for tauri GUI:

```
sudo dnf install pkgconf-pkg-config javascriptcoregtk4.1-devel
sudo dnf install @development-tools pkgconf-pkg-config webkit2gtk4.1-devel
```


### Build and Run Instructions

Clone the repository to your local machine and use the following commands to set up, build, and run the application:

```bash
# 1. Clone the repository
git clone [https://github.com/GriffonAV/GriffonAV.git](https://github.com/GriffonAV/Griffon.git)
cd Griffon

# 2. Install GUI dependencies
just setup-gui

# 3. Build the core Rust application
cargo build

# 4. Update and prepare the plugins
just run update-plugins

# 5. Start the backend daemon (Run this in your first terminal)
just run-daemon

# 6. Start the GUI (Run this in a second terminal)
just run-gui
```