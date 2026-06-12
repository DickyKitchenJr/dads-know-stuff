"use client";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import styles from "./page.module.css";
import DadviceImage from "@/assets/images/dadvice-no-text.png";
import { dadAdvice } from "./data";
import { useState } from "react";
import { checkForBannedWordsOrSelectSymbols } from "@/helpers/bannedInputs";
import Link from "next/link";

export default function Dadvice() {
  const [loadedAdvice, setLoadedAdvice] = useState<[string, string?][]>(() => [
    ...dadAdvice,
  ]);
  const [newAdvice, setNewAdvice] = useState<[string, string?]>(["", ""]);
  const [submitAdviceButtonDisabled, setSubmitAdviceButtonDisabled] =
    useState(true);
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [bannedInputDetected, setBannedInputDetected] = useState(false);

  const handleAdviceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAdviceText = e.target.value;
    setNewAdvice((prevAdvice) => [newAdviceText, prevAdvice[1]]);
    setSubmitAdviceButtonDisabled(newAdviceText === "" || newAdvice[1] === "");
    setBannedInputDetected(
      checkForBannedWordsOrSelectSymbols(newAdviceText) ||
        checkForBannedWordsOrSelectSymbols(newAdvice[1] || ""),
    );
  };

  const handleAdviceGiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAdviceGiver = e.target.value;
    setNewAdvice((prevAdvice) => [prevAdvice[0], newAdviceGiver]);
    setSubmitAdviceButtonDisabled(newAdvice[0] === "" || newAdviceGiver === "");
    setBannedInputDetected(
      checkForBannedWordsOrSelectSymbols(newAdvice[0]) ||
        checkForBannedWordsOrSelectSymbols(newAdviceGiver || ""),
    );
  };

  return (
    <main className={styles["main"]}>
      <NavBar />
      <Header
        title="Dadvice"
        subtitle="Advice from dads advice worth sharing."
        logoSrc={DadviceImage}
        logoAlt="a drawing of a silhouette of a dad holding a child's hand"
      />
      <div className={styles["advice-container"]}>
        {loadedAdvice.map((advice, index) => (
          <div className={styles["advice-box"]} key={index}>
            <p className={styles["advice"]}>{advice[0]}</p>
            {advice[1] ? (
              <p className={styles["advice"]}>- {advice[1]}</p>
            ) : (
              <p className={styles["advice"]}>- Anonymous</p>
            )}
          </div>
        ))}
      </div>
      <div className={styles["submit-advice-outer-div"]}>
        <div className={styles["submit-advice-info-div"]}>
          <h2 className={styles["submit-advice-h2"]}>
            Want to share advice from a dad?
          </h2>
          <p className={styles["submit-advice-p"]}>
            We currently list everything on one page, but our goal is to grow
            our collection of dadvice so large that we can justify creating a
            different section for every topic covered.
            <br />
            Share the best advice you've received from a dad, or if you are a
            dad the best advice you've given, and help us achieve our goal while
            spreading the wisdom of dads with the world!
            <br />
            Please review our{" "}
            <Link href="/privacy-usage">Privacy & Usage Policy</Link> before
            submitting. By submitting, you are agreeing to them.
          </p>
        </div>
        <form
          className={styles["submit-advice-form"]}
          onSubmit={(e) => e.preventDefault()}
        >
          <label className={styles["submit-advice-label"]} htmlFor="advice">
            Advice:
          </label>
          <textarea
            className={styles["submit-advice-textarea"]}
            id="advice"
            placeholder="Give advice here..."
            onChange={handleAdviceChange}
          />
          <label
            className={styles["submit-advice-label"]}
            htmlFor="advice-giver"
          >
            Dad to credit (optional):
          </label>
          <input
            className={styles["submit-advice-textarea"]}
            id="advice-giver"
            type="text"
            placeholder="Enter the dad's name here..."
            onChange={handleAdviceGiverChange}
          />
          {submissionSuccessful && (
            <p className={styles["submit-success-message"]}>
              Submission Successful!
              <br />
              The Council of Dads will review the advice and if it meets our
              guidelines we will add it to the page and it will be visible to
              everyone. Thank you for your submission.
            </p>
          )}
          {bannedInputDetected ? (
            <p className={styles["submit-advice-error-message"]}>
              We ban certain words and symbols from our inputs to prevent misuse
              of our site. Please remove any inappropriate language and symbols
              and try again.
            </p>
          ) : null}
          <button
            className={styles["submit-advice-button"]}
            type="submit"
            disabled={submitAdviceButtonDisabled}
          >
            Submit Advice
          </button>
        </form>
      </div>
    </main>
  );
}
