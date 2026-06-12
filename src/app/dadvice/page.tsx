import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import styles from "./page.module.css";
import DadviceImage from "@/assets/images/dadvice-no-text.png";

export default function Dadvice() {
    return (
      <main className={styles["main"]}>
        <NavBar />
        <Header title="Dadvice" subtitle="Dads advice worth sharing." logoSrc={DadviceImage} logoAlt="a drawing of a silhouette of a dad holding a child's hand" />
      </main>
    );
}