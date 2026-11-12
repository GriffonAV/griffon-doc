import { usePluginData } from "@docusaurus/useGlobalData";
import type { ReleasesData } from "../../plugins/github-releases";

export const RELEASES_URL = "https://github.com/GriffonAV/griffon/releases";

/** Griffon releases fetched from GitHub at build time (newest first). */
export function useReleases(): ReleasesData {
  return usePluginData("github-releases") as ReleasesData;
}
