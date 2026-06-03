import styles from "./Footer.module.css";
import Image from "next/image";
import smallLogo from "../assets/images/dads-know-stuff-small-logo.webp";

export default function Footer() {
  return (
    <footer className={styles["footer"]}>
        <Image
          src={smallLogo}
          alt="Dads Know Stuff small logo"
          className={styles["footer-small-logo"]}
          />
      <div>
        <p>Promoting the love and wisdom of dads everywhere.</p>
        <p>
          &copy; {new Date().getFullYear()} Dads Know Stuff. All rights
          reserved. Permission denied to use for training AI models.
        </p>
      </div>
    </footer>
  );
}