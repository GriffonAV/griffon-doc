import type { LoadContext, Plugin } from "@docusaurus/types";

/**
 * Fetches the Griffon releases from GitHub at build time and exposes them as
 * global data (read with `useReleases()` from `@site/src/hooks/useReleases`).
 *
 * The site is rebuilt by a Vercel deploy hook at the end of the griffon
 * release workflow, so the list updates on every release.
 * Set GITHUB_TOKEN in the build environment to avoid the anonymous rate limit.
 */

export const RELEASES_REPO = "GriffonAV/griffon";

export type Release = {
  tag: string;
  url: string;
  publishedAt: string; // ISO date
  prerelease: boolean;
};

export type ReleasesData = {
  releases: Release[]; // newest first
  latest: Release | null; // GitHub's "Latest": newest non-prerelease
};

type GitHubRelease = {
  tag_name: string;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
};

async function fetchReleases(): Promise<Release[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "griffon-doc-build",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(
    `https://api.github.com/repos/${RELEASES_REPO}/releases?per_page=100`,
    { headers },
  );
  if (!res.ok) {
    throw new Error(`GitHub API answered ${res.status} ${res.statusText}`);
  }

  const body = (await res.json()) as GitHubRelease[];
  return body
    .filter((r) => !r.draft && r.published_at)
    .map((r) => ({
      tag: r.tag_name,
      url: r.html_url,
      publishedAt: r.published_at as string,
      prerelease: r.prerelease,
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export default function githubReleasesPlugin(
  _context: LoadContext,
): Plugin<ReleasesData> {
  return {
    name: "github-releases",

    async loadContent() {
      try {
        const releases = await fetchReleases();
        return {
          releases,
          latest: releases.find((r) => !r.prerelease) ?? null,
        };
      } catch (err) {
        // Never fail the build: the pages fall back to a link to GitHub.
        console.warn(`[github-releases] Could not fetch releases: ${err}`);
        return { releases: [], latest: null };
      }
    },

    async contentLoaded({ content, actions }) {
      actions.setGlobalData(content);
    },
  };
}
