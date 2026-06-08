import styles from "./Header.module.css";
import Image from "next/image";
import type { StaticImageData } from "next/image";

type HeaderProps = {
  title: string;
  subtitle: string;
  logoSrc: StaticImageData | null;
  logoAlt: string | null;
};

export default function Header({ title, subtitle, logoSrc, logoAlt }: HeaderProps) {
  return (
    <header className={styles["header"]}>
      {logoSrc && <Image className={styles["header-logo"]} src={logoSrc} alt={logoAlt || ""} />}
      <h1 className={styles["header-h1"]}>{title}</h1>
      <p className={styles["header-subtitle"]}>{subtitle}</p>
    </header>
  );
}