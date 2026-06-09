import styles from "./page.module.css";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";

export default function PrivacyUsage() {
  return (
    <main className={styles["main"]}>
      <NavBar />
      <Header
        title="PRIVACY & USAGE"
        subtitle="Dads Know Stuff knows that privacy and clarity are important. Please review the following information to understand how we handle information submitted to our site and how we use it."
        logoSrc={null}
        logoAlt={null}
      />
      <div className={styles["privacy-usage-outer-div"]}>
        <h2 className={styles["privacy-usage-h2"]}>The Simple Facts -</h2>
        <p className={styles["privacy-usage-p"]}>
          We believe in keeping things simple and transparent, so we have broken
          down our policies into two sections: What We Do & What We Don't Do.
        </p>
        <h3 className={styles["privacy-usage-h3"]}>What We Don't Do:</h3>
        <ul className={styles["privacy-usage-ul"]}>
          <li className={styles["privacy-usage-li"]}>
            We don't sell your information to data brokers; we want Dads Know
            Stuff to succeed because of our community, not because of your data.
          </li>
          <li className={styles["privacy-usage-li"]}>
            We don't use your information for AI training; dads can not be
            replaced by AI. Not only do we not use your submissions for creating
            an AI for ourselves, we also take steps to prevent others from using
            your information for AI training.
          </li>
          <li className={styles["privacy-usage-li"]}>
            We don't allow cursing or vulgarity to be posted on our site; we
            take steps to prevent this type of content from being submitted
            automatically, but we also have the added step of human oversight to
            prevent submissions from getting through that don't respect our
            community standards.
          </li>
          <li className={styles["privacy-usage-li"]}>
            We don't allow bigotry or discrimination of any kind; our community
            is built on respect and inclusivity. Everyone needs a dad sometimes,
            regardless of their background or identity.
          </li>
        </ul>
        <h3 className={styles["privacy-usage-h3"]}>What We Do:</h3>
        <ul className={styles["privacy-usage-ul"]}>
          <li className={styles["privacy-usage-li"]}>
            We review submissions and reserve the right to remove or edit
            any content that doesn't match the good intent of Dads Know Stuff
            and our community.
          </li>
          <li className={styles["privacy-usage-li"]}>
            We rely on community support to succeed. In a world full of AI
            dribble, we value the genuine contributions of our community members
            and need them to spread the word about our existence.
          </li>
          <li className={styles["privacy-usage-li"]}>
            We may use what is submitted to the site both on the site and in
            attempts to help grow and support the site.
          </li>
          <li className={styles["privacy-usage-li"]}>
            We take steps to make Dads Know Stuff a safe and welcoming
            environment for everyone, and share the love and knowledge that dads
            provide.
          </li>
        </ul>
        <h3 className={styles["privacy-usage-h3"]}>TLDR -</h3>
        <p className={styles["privacy-usage-p"]}>
          We value our community and will not sell your information to data
          brokers nor use it to train AI. Beyond that, we use the content
          submitted to benefit Dads Know Stuff and our community, with the goal
          of sharing the love and knowledge that dads provide in a safe and
          welcoming environment.
        </p>
      </div>
    </main>
  );
}
