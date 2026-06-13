import Image from "next/image";
import styles from "./page.module.css";
import largeLogo from "../assets/images/dads-know-stuff-large-logo.webp";
import heroImage from "../assets/images/rando-dads-with-arch.webp";
import dadFactsLogo from "../assets/images/dad-facts-logo.webp";
import dadabaseLogo from "../assets/images/dadabase-logo.webp";
import dadgramLogo from "../assets/images/dadgram-logo.webp";
import dadviceLogo from "../assets/images/dadvice-logo.webp";
import merchLogo from "../assets/images/merch-logo.webp";
import NavCards from "../components/NavCards";

export default function Home() {
  return (
    <main className={styles["main"]}>
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
          alt="semi-realistic cartoon of 5 random dads of different ethnicities standing in an arch"
          priority
          className={styles["hero-image"]}
        />
      </div>
      <div className={styles["divider"]}>
        <p className={styles["divider-text"]}>
          Because sometimes, you just need a dad.
        </p>
      </div>
      <nav className={styles["nav-cards-container"]}>
        <NavCards
          title="Dad Joke Database"
          description="Share the joy of laughter with the ultimate collection of dad jokes."
          image={dadabaseLogo}
          imageAlt="Dadabase logo with a laughing cartoon face"
          linkText="EXPLORE THE JOKES"
          linkHref="/dad-abase"
        />
        <NavCards
          title="Dad Advice"
          description="Our dads share their advice on topics ranging from the mundane to the profound. If you need a dad's view on something, this is the place."
          image={dadviceLogo}
          imageAlt="Dadvice logo showing a silhouette of a dad holding a child's hand."
          linkText="GET DADVICE"
          linkHref="/dadvice"
        />
        <NavCards
          title="The Science of Dads"
          description="Why dads matter and how they impact our lives in ways we may not even realize."
          image={dadFactsLogo}
          imageAlt="Dad Facts logo showing an open book."
          linkText="LEARN MORE"
          linkHref="/dad-facts"
        />
        <NavCards
          title="Dad Love Merch"
          description="Help support the site and show a dad some love by grabbing some gear from our Dads Know Stuff shop: Currently externally hosted on Fourthwall."
          image={merchLogo}
          imageAlt="Merch logo showing a t-shirt."
          externalLinkText="SHOP DAD MERCH"
          externalLinkHref="https://dads-know-stuff-shop.fourthwall.com/"
        />
        <NavCards
          title="Send a Dad-gram"
          description="Tell a dad they matter by sending them a dad-gram using our custom link."
          image={dadgramLogo}
          imageAlt="Dadgram logo showing a paper airplane."
          linkText="SEND A DAD-GRAM"
          linkHref="/dad-gram"
        />
      </nav>
    </main>
  );
}
