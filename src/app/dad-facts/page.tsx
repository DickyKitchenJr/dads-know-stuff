import NavBar from "@/components/NavBar";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Dadfacts from "@/assets/images/dad-facts-no-text.png";

export default function DadFacts() {
  return (
    <main className={styles["main"]}>
      <NavBar />
      <Header
        title="DAD FACTS"
        subtitle="Things you may not know about dads and fatherhood."
        logoSrc={Dadfacts}
        logoAlt="a drawing of an open book, representing the knowledge of dad facts"
      />
      <div className={styles["dad-facts-outer-div"]}>
        <p className={styles["dad-facts-p"]}>
          It's becoming more apparent that dads play a vital role in life, and
          science is paying more attention to exactly what that means.
          <br />
          Here are a few facts we came across when researching what it means to
          be a dad:
        </p>
        <div className={styles["dad-facts-inner-div"]}>
          <h2 className={styles["dad-facts-h2"]}>Fact 1 -</h2>
          <p className={styles["dad-facts-p"]}>
            According to a study published on{" "}
            <a
              href="https://psycnet.apa.org/fulltext/2026-94777-001.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              APA PsycNet
            </a>
            , dads who have sensitive engagement with their toddlers and infants
            have a positive impact on their children's cardiometabolic health.
            Meaning that dads who are involved in their children's lives and are
            willing to show sensitivity help their children's hearts.
          </p>
        </div>
        <div className={styles["dad-facts-inner-div"]}>
          <h2 className={styles["dad-facts-h2"]}>Fact 2 -</h2>
          <p className={styles["dad-facts-p"]}>
            Multiple studies and articles support the idea that fathers who are
            actively involved in their infants lives get the benefit of having
            their bodies produce hormones that decrease stress and promote
            happiness. That means being a dad can be good for the dad too!
          </p>
        </div>
        <div className={styles["dad-facts-inner-div"]}>
          <h2 className={styles["dad-facts-h2"]}>Fact 3 -</h2>
          <p className={styles["dad-facts-p"]}>
            According to the book "Do Fathers Matter? What Science Is Telling Us
            about the Parent We’ve Overlooked" by Paul Raeburn, dads who are
            involved in their children's education result in children performing
            better in school. Dads can make you smarter!
          </p>
        </div>
        <div className={styles["dad-facts-inner-div"]}>
          <h2 className={styles["dad-facts-h2"]}>Fact 4 -</h2>
          <p className={styles["dad-facts-p"]}>
            According to a study published by{" "}
            <a
              href="http://virtualworker.pbworks.com/f/Paternal%2520Involvement.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              PR Amato and F Rivera in the Journal of Marriage and the Family in
              1999,
            </a>
            having either an active dad or an active stepdad involved in a
            child's life leads to decreased behavioral problems. This shows that
            being a dad is about more than a blood relationship, and that dads
            and stepdads both deserve respect for being loving dads.
          </p>
        </div>
        <div className={styles["dad-facts-inner-div"]}>
          <h2 className={styles["dad-facts-h2"]}>Fact 5 -</h2>
          <p className={styles["dad-facts-p"]}>
            In the writings of{" "}
            <a
              href="https://library.parenthelp.eu/wp-content/uploads/2017/05/Effects_of_Father_Involvement.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Effects of Father Involvement:An Updated Research Summary of
              the Evidence Inventory, © Centre for Families, Work & Well-Being,
              University of Guelph 2007,
            </a>{" "}
            it is discussed that dads' involvement can lower the stress of
            children and mothers, and lead to more resilient children as they
            grow up. This shows that dads are a benefit to the whole family!
          </p>
        </div>
      </div>
    </main>
  );
}
