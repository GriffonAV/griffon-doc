import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Head from "@docusaurus/Head";
import Translate, { translate } from "@docusaurus/Translate";
import useBaseUrl, { useBaseUrlUtils } from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

function HeroBanner() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <div className={styles.hero} data-theme="dark">
      <div className={styles.heroInner}>
        <Heading as="h1" className={styles.heroProjectTagline}>
          <img
            alt={translate({ message: "Griffon logo" })}
            className={styles.heroLogo}
            src={useBaseUrl("/img/logo.png")}
            width="200"
            height="200"
          />
          <span
            className={styles.heroTitleTextHtml}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: translate({
                id: "homepage.hero.title",
                message:
                  "A modular Linux security toolkit featuring a high-speed <b>Malware Scanner</b> and a <b>System Cleaner</b>.",
                description:
                  "Home page hero title, can contain simple html tags",
              }),
            }}
          />
        </Heading>

        {/* New Subtitle directing them to learn more */}
        <p style={{ fontSize: "1.25rem", margin: "1rem 0 2rem 0", opacity: 0.9 }}>
          Built with passion in Rust. Discover how our plugins work under the hood.
        </p>

        {/* Updated Call to Action Buttons */}
        <div className={styles.indexCtas}>
          <Link className="button button--primary button--lg" to="/docs/introduction">
            <Translate>Learn More in Docs</Translate>
          </Link>
          <Link className="button button--secondary button--lg" to="/docs/installation">
            <Translate>Install v0.3</Translate>
          </Link>
          <Link className="button button--info button--lg" to="https://github.com/GriffonAV/GriffonAV/releases/latest">
            <Translate>GitHub Packages</Translate>
          </Link>
          <span className={styles.indexCtasGitHubButtonWrapper}>
            <iframe
              className={styles.indexCtasGitHubButton}
              src="https://ghbtns.com/github-btn.html?user=GriffonAV&repo=GriffonAV&type=star&count=true&size=large"
              width={160}
              height={30}
              title="GitHub Stars"
            />
          </span>
        </div>
      </div>
    </div>
  );
}

function TopBannerForRelease() {
  // TODO We should be able to strongly type customFields
  //  Refactor to use a CustomFields interface + TS declaration merging
  const announcedVersion = useDocusaurusContext().siteConfig.customFields
    ?.announcedVersion as string;

  return (
    <div className={styles.topBanner}>
      <div className={styles.topBannerTitle}>
        {"🎉\xa0"}
        <Link
          to={`/blog/releases/${announcedVersion}`}
          className={styles.topBannerTitleText}
        >
          <Translate
            id="homepage.banner.launch.newVersion"
            values={{ newVersion: announcedVersion }}
          >
            {"Docusaurus\xa0{newVersion} is\xa0out!️"}
          </Translate>
        </Link>
        {"\xa0🥳"}
      </div>
    </div>
  );
}

function TopBanner() {
  return (
    <div className={styles.topBanner}>
      <div className={styles.topBannerTitle}>
        {"🎉\xa0"}
        <Link to="/docs/installation" className={styles.topBannerTitleText}>
          <Translate id="homepage.banner.v03">
            Griffon v0.3 is out!
          </Translate>
        </Link>
        {"\xa0🎉"}
      </div>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <main>
      <TopBanner />
      <HeroBanner />
    </main>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  const title = `Griffon | Linux Antivirus`;
  const description = "Keep it safe. Simple and efficient.";
  const imageUrl = "https://griffon-av.vercel.app/img/griffon.png";

  return (
    <Layout title={title} description={description}>
      <Head>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content="https://griffon-av.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
