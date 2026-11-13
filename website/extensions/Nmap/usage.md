---
sidebar_position: 2
title: Usage
description: How to use the Nmap extension
---

# Using Nmap

## Run an authorised scan

1. Open the **Nmap** extension and select the **Scan** tab.
2. Enter one IP address or hostname in **Target**. Targets cannot be a range,
   list, shell expression or value containing whitespace.
3. Choose a profile. Use `quick` for a small default scan, `web` for common web
   ports, `full_tcp` for all TCP ports, `discovery` for host discovery, `udp` for
   UDP, or `service` for service-focused work.
4. Choose the timing level (`T3` or `T4`) and, if required, provide ports such
   as `22,80,443` or `8000-8100`.
5. Enable only the options needed: skip host discovery (`-Pn`), version
   detection (`-sV`), OS detection (`-O`) or default scripts (`-sC`).
6. Choose **Local** or **Exegol** as the executor. For Exegol, refresh the
   container list and select an active Exegol container.
7. Run the scan and review the message, generated command and structured host
   and port results.

The generated command is displayed for transparency. Arguments are passed to
the process without shell interpolation.

## Important combinations

- `discovery` cannot be combined with version or OS detection.
- `syn` scan type requires elevated privileges; use `auto` or `connect` when
  elevated privileges are unavailable.
- If no host is found, enable **Skip host discovery** and retry only when the
  target is known to be reachable and authorised.
- Nmap must be installed for local execution. Exegol execution also requires a
  working Docker daemon and a valid selected container.

## HTTP and service probes

After a scan, the plugin can run an HTTP probe against an authorised host and
port, or a service probe for a detected service/action. These probes are
separate operations and their output is displayed with the command and target.
Use them only against systems in scope for your assessment.

## Manage history

Open the **History** tab and select **Refresh** to load saved scans. An
individual entry can be deleted, or the complete history can be cleared. A scan
is stored only after Nmap completes successfully; an error from Nmap or from
history persistence is reported to the user.

## Troubleshooting

- **Invalid target:** enter a single IP address or hostname without spaces,
  commas, CIDR notation or ranges.
- **No active host:** verify DNS and reachability, then consider `-Pn` for a
  known-live target.
- **Nmap unavailable:** install or expose the `nmap` executable to the daemon,
  or select a configured Exegol executor.
- **Empty Exegol list:** Docker is unavailable, or no running container with an
  Exegol image/label was found.
