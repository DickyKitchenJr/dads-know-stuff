import styles from "./NavCards.module.css";
import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import rightArrow from "../assets/images/right-arrow.svg";

type NavCardProps = {
  title: string;
  description: string;
  image: StaticImageData;
  imageAlt: string;
  linkText: string;
  linkHref: string;
};

export default function NavCards({
  title,
  description,
  image,
  imageAlt,
  linkText,
  linkHref,
}: NavCardProps) {
  return (
    <div className={styles["nav-cards"]}>
      <Image src={image} alt={imageAlt} className={styles["nav-card-logo"]} />
      <h2 className={styles["nav-card-title"]}>{title}</h2>
      <p className={styles["nav-card-description"]}>{description}</p>
      <Link href={linkHref} className={styles["nav-card"]}>
        {linkText} &nbsp; &#8594;
      </Link>
    </div>
  );
}
