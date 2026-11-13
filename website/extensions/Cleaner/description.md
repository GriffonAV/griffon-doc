---
sidebar_position: 1
title: Description
description: What is the Cleaner extension
---

# Cleaner

Cleaner helps you inspect and remove reclaimable files from the locations
configured for Griffon. It is designed to make the scope of a cleanup visible
before anything is deleted.

The extension currently exposes two modules:

- **Cache Cleaner**, which analyses configured system, user, browser,
  development, package-manager and desktop-environment cache locations.
- **Docker Cleaner**, which reports reclaimable Docker resources and, when a
  real cleanup is explicitly requested, prepares the corresponding Docker
  prune actions.

Cleaner does not remove files during analysis. The result includes the selected
profile and file types, touched files, reclaimable bytes, warnings, errors and
permission-denied counts for each module.

## Safety model

Cleaner starts in **dry-run mode**. In that mode it can analyse or list
candidates, but deletion is only previewed. Keep dry-run enabled while checking
the candidate list and disable it only when the selected paths and file types
are understood.

The configured `root_paths` determine where the modules look. They are not a
security sandbox: do not point them at locations you do not intend to inspect,
and treat Docker cleanup as an operation on the Docker daemon selected by the
environment.

The default debug profile is `profiles/light.json`. It uses the `safe` profile,
keeps dry-run enabled, and enables all currently supported cache categories.
