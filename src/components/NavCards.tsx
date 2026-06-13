import styles from "./NavCards.module.css";
import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";

type NavCardProps = {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  linkText?: string;
  linkHref?: string;
  externalLinkText?: string;
  externalLinkHref?: string;
};

export default function NavCards({
  title,
  description,
  image,
  imageAlt,
  linkText,
  linkHref,
  externalLinkText,
  externalLinkHref,
}: NavCardProps) {
  return (
    <div className={styles["nav-cards"]}>
      <Image src={image} alt={imageAlt} className={styles["nav-card-logo"]} />
      <h2 className={styles["nav-card-title"]}>{title}</h2>
      <p className={styles["nav-card-description"]}>{description}</p>
      {linkHref && linkText && (
        <Link href={linkHref} className={styles["nav-card"]}>
          {linkText} &nbsp; &#8594;
        </Link>
      )}
      {externalLinkHref && externalLinkText && (
        <a href={externalLinkHref} className={styles["nav-card"]} target="_blank" rel="noopener noreferrer">
          {externalLinkText} &nbsp; &#8594;
        </a>
      )}
    </div>
  );
}
