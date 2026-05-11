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
        <div className={styles["hero-inner-div"]}>
          <p className={styles["hero-impact-text"]}>REAL KNOWLEDGE.</p>
          <p className={styles["hero-impact-text"]}>REAL JOKES.</p>
          <p className={styles["hero-impact-text"]}>REAL LOVE.</p>
          <p className={styles["hero-impact-text"]}>REAL DADS.</p>
        </div>
        <Image
          src={heroImage}
          alt="A group of dads under an arch"
          priority
          sizes="(max-width: 900px) 100vw, 808px"
          style={{ width: "100%", maxWidth: "808px", height: "auto" }}
        />
      </div>
    </main>
  );
}
