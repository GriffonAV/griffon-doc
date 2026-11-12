import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import { RELEASES_URL, useReleases } from "@site/src/hooks/useReleases";

/** Every published Griffon release, from GitHub, newest first. */
export default function ReleaseTable(): ReactNode {
  const { releases, latest } = useReleases();

  if (releases.length === 0) {
    return (
      <p>
        See the <Link to={RELEASES_URL}>GitHub Releases page</Link>.
      </p>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Version</th>
          <th>Released</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {releases.map((r) => (
          <tr key={r.tag}>
            <td>
              <Link to={r.url}>
                <b>{r.tag}</b>
              </Link>
            </td>
            <td>{r.publishedAt.slice(0, 10)}</td>
            <td>
              {r.tag === latest?.tag ? "Latest" : r.prerelease ? "Pre-release" : ""}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
