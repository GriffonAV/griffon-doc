---
sidebar_position: 1
title: Description
description: What is the Nmap extension
---

# Nmap

Nmap runs authorised network scans and presents structured results in Griffon.
For each discovered host it can show the address, hostname, state and detected
ports, including protocol, state, service, product and version information.

The extension has two tabs:

- **Scan**, for configuring and running a scan, optional HTTP or service probes,
  and reviewing the result.
- **History**, for refreshing, deleting individual entries, or clearing the
  stored scan history.

## Scan profiles

The available profiles are:

| Profile | Default port selection / purpose |
| --- | --- |
| `quick` | Fast scan of Nmap's common ports (`-F`) |
| `web` | Web ports `80,443,8080,8443` |
| `full_tcp` | All TCP ports (`-p-`) |
| `service` | Service-oriented scan; specify ports when needed |
| `discovery` | Host discovery only (`-sn`) |
| `udp` | UDP scan (`-sU`) |

An explicit port list such as `22,80,443` or a range such as `8000-8100`
replaces the profile's default port selection.

Scans can run with the local Nmap binary or through a selected active Exegol
container. Results are stored locally in debug builds at
`.data/griffon/nmap/history.json` and in installed builds at
`/var/lib/griffon/nmap/history.json`; the history is limited to the 100 most
recent scans.

Only scan systems and networks for which you have explicit authorisation.
