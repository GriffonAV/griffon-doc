---
sidebar_position: 2
title: Usage
description: How to use the Cleaner extension
---

# Using Cleaner

## Preview a cleanup

1. Open the **Cleaner** extension and choose the **Dashboard** tab.
2. Leave **Dry-run mode** enabled.
3. Optionally select one or more **Targeted file types**. If none are selected,
   all file types are included.
4. Select **Run analysis**.
5. Review the overview by module: candidate files, reclaimable bytes,
   warnings, errors and permission-denied entries.

The dashboard reports the selected profile, enabled categories and selected file
types so that the scope can be checked against the intended cleanup.

## Review and select candidates

Use the **Main** tab and select **Refresh candidates**. You can apply the same
file-type filter, inspect each candidate path, and select individual paths. The
selection is cleared when Cleaner options change or after a deletion request.

## Delete selected files

1. Confirm the candidate paths and the file-type filter.
2. Keep dry-run enabled for a final preview, or disable it to perform the
   deletion.
3. Select **Delete selected** (or delete one candidate from the candidate
   list).
4. Check the result: deleted count, deleted bytes and any per-path failures.

Partial failures are reported; a successful result does not imply that every
selected path was deleted. Refresh the candidate list after the operation.

## Docker cleanup

Docker actions are shown in the Docker module report. In dry-run mode, Cleaner
only displays the action plan. Real Docker cleanup is destructive and can affect
containers, images, build cache or volumes, so verify the selected Docker daemon
and the proposed actions before disabling dry-run.

## Common issues

- **Permission denied:** run Cleaner with the permissions required to inspect
  the configured paths, or narrow the scope. The report keeps permission
  failures separate from successful work.
- **No candidates:** check the configured root paths and file-type filter.
- **No category enabled:** the configuration must enable at least one cache
  category.
