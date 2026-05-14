import Image from "next/image";
import styles from "./page.module.css";
import largeLogo from "../assets/images/dads-know-stuff-large-logo.webp";
import smallLogo from "../assets/images/dads-know-stuff-small-logo.webp";
import heroImage from "../assets/images/rando-dads-with-arch.webp";

export default function Home() {
  return (
    <main>
      <h1 className={styles["h1-homepage"]}>
        <Image
          src={largeLogo}
          alt="Dads Know Stuff large logo"
          className={styles["h1-logo"]}
        />
        <span className={styles["screen-reader-h1"]}>Dads Know Stuff</span>
      </h1>
      <div className={styles["hero-outer-div"]}>
        <div>
          <div className={styles["hero-impact-text-div"]}>
            <p className={styles["hero-impact-text"]}>REAL LOVE.</p>
            <p className={styles["hero-impact-text"]}>REAL KNOWLEDGE.</p>
            <p className={styles["hero-impact-text"]}>REAL JOKES.</p>
          </div>
          <p className={styles["hero-standout-text"]}>REAL DADS.</p>
          <div className={styles["hero-subtext-div"]}>
            <p className={styles["hero-subtext"]}>
              Sharing all the things that make dads great,
            </p>
            <p className={styles["hero-subtext"]}>
              and reminding them they are valued.
            </p>
          </div>
        </div>
        <Image
          src={heroImage}
          alt="A group of dads under an arch"
          priority
          sizes="(max-width: 900px) 100vw, 808px"
          className={styles["hero-image"]}
        />
      </div>
      <div className={styles["divider"]}>
        <p className={styles["divider-text"]}>Because sometimes, you just need a dad.</p>
      </div>
    </main>
  );
}
