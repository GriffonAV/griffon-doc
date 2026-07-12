import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Img: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Driven by Passion for Rust & Linux",
    Img: require("@site/static/img/rust.png").default,
    description: (
      <>
        We are a team of Four students who love Rust and the Linux ecosystem.
        Griffon is our journey to build a complete, real-world application from the
        ground up, allowing us to deeply understand system architecture, memory safety,
        and backend-to-frontend communication.
      </>
    ),
  },
  {
    title: "Modular Daemon & Auto-GUI",
    // Tip: You might want to add a plugin/gear icon to your static/img folder for this one!
    Img: require("@site/static/img/app.png").default,
    description: (
      <>
        Griffon runs as a background daemon powering a seamless plugin system.
        You focus on writing the core logic in Rust, and we automatically generate
        the GUI with minimal configuration. We currently feature two native plugins:
        a high-speed <b>Malware Scanner</b> and a <b>System Cleaner</b>.
      </>
    ),
  },
  {
    title: "Open Research & Transparent Process",
    Img: require("@site/static/img/notion.png").default,
    description: (
      <>
        All our work is public! We are very proud to present this project, and while
        it is far from perfect, we would absolutely love your feedback. You can explore
        our entire work process, architecture decisions, and research on our{" "}
        <a href="https://blue-touch-18c.notion.site/Griffon-AV-1c6f05587c8380eb9fbeea36f549fd47?pvs=74">
          public Notion board
        </a>.
      </>
    ),
  },
];

function Feature({ title, Img, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img src={Img} className={styles.featureImg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}