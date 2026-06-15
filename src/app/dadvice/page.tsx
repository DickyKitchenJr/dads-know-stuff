"use client";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import styles from "./page.module.css";
import DadviceImage from "@/assets/images/dadvice-no-text.webp";
import { dadAdvice } from "./data";
import { useCallback, useEffect, useState } from "react";
import { checkForBannedWordsOrSelectSymbols } from "@/helpers/bannedInputs";
import Link from "next/link";

const ADVICE_PER_LOAD = 8;
const DB_ADVICE_BATCH_SIZE = 32;
const PREFETCH_THRESHOLD = 8;

type DadviceApiAdvice = {
  id: number;
  advice: string;
  giver: string | null;
  createdAt: string;
};

const mergeUniqueAdvice = (
  existingAdvice: [string, string?][],
  incomingAdvice: [string, string?][],
) => {
  const seenAdvice = new Set(
    existingAdvice.map((advice) => `${advice[0]}::${advice[1] ?? ""}`),
  );
  const mergedAdvice = [...existingAdvice];

  for (const advice of incomingAdvice) {
    const adviceKey = `${advice[0]}::${advice[1] ?? ""}`;
    if (!seenAdvice.has(adviceKey)) {
      seenAdvice.add(adviceKey);
      mergedAdvice.push(advice);
    }
  }

  return mergedAdvice;
};

export default function Dadvice() {
  const [loadedAdvice, setLoadedAdvice] = useState<[string, string?][]>(() => [
    ...dadAdvice,
  ]);
  const [adviceCount, setAdviceCount] = useState(8);
  const [newAdvice, setNewAdvice] = useState<[string, string?]>(["", ""]);
  const [submitAdviceButtonDisabled, setSubmitAdviceButtonDisabled] =
    useState(true);
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannedInputDetected, setBannedInputDetected] = useState(false);
  const [honeypotWebsite, setHoneypotWebsite] = useState("");
  const [dbSkip, setDbSkip] = useState(0);
  const [hasMoreDbAdvice, setHasMoreDbAdvice] = useState(true);
  const [isFetchingDbAdvice, setIsFetchingDbAdvice] = useState(false);
  const [adviceFetchError, setAdviceFetchError] = useState("");

  const parseSubmissionError = async (response: Response) => {
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      if (retryAfter) {
        return `Too many submissions right now. Please wait ${retryAfter} seconds and try again.`;
      }
      return "Too many submissions right now. Please try again shortly.";
    }

    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        return payload.error;
      }
    } catch {
      return "Unable to submit your advice right now. Please try again.";
    }

    return "Unable to submit your advice right now. Please try again.";
  };

  const fetchMoreDbAdvice = useCallback(async () => {
    if (isFetchingDbAdvice || !hasMoreDbAdvice) {
      return;
    }

    setIsFetchingDbAdvice(true);

    try {
      const response = await fetch(
        `/api/dadvice?skip=${dbSkip}&take=${DB_ADVICE_BATCH_SIZE}`,
      );

      if (!response.ok) {
        setAdviceFetchError("Unable to load more advice right now.");
        setHasMoreDbAdvice(false);
        return;
      }

      const payload = (await response.json()) as {
        advice?: DadviceApiAdvice[];
      };
      const incomingAdvice = (payload.advice ?? []).map(
        (advice) =>
          [advice.advice, advice.giver ?? undefined] as [string, string?],
      );

      setLoadedAdvice((prevAdvice) =>
        mergeUniqueAdvice(prevAdvice, incomingAdvice),
      );
      setDbSkip((prevSkip) => prevSkip + incomingAdvice.length);
      setAdviceFetchError("");

      if (incomingAdvice.length < DB_ADVICE_BATCH_SIZE) {
        setHasMoreDbAdvice(false);
      }
    } catch {
      setAdviceFetchError("Unable to load more advice right now.");
      setHasMoreDbAdvice(false);
    } finally {
      setIsFetchingDbAdvice(false);
    }
  }, [dbSkip, hasMoreDbAdvice, isFetchingDbAdvice]);

  useEffect(() => {
    if (dbSkip === 0 && hasMoreDbAdvice && !isFetchingDbAdvice) {
      void fetchMoreDbAdvice();
    }
  }, [dbSkip, fetchMoreDbAdvice, hasMoreDbAdvice, isFetchingDbAdvice]);

  useEffect(() => {
    const remainingVisibleAdvice = loadedAdvice.length - adviceCount;

    if (
      remainingVisibleAdvice <= PREFETCH_THRESHOLD &&
      hasMoreDbAdvice &&
      !isFetchingDbAdvice &&
      !adviceFetchError
    ) {
      void fetchMoreDbAdvice();
    }
  }, [
    adviceCount,
    adviceFetchError,
    fetchMoreDbAdvice,
    hasMoreDbAdvice,
    isFetchingDbAdvice,
    loadedAdvice.length,
  ]);

  const loadMoreAdvice = () => {
    if (adviceCount >= loadedAdvice.length) {
      return;
    }

    setAdviceCount((prevCount) =>
      Math.min(prevCount + ADVICE_PER_LOAD, loadedAdvice.length),
    );
  };

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
    setSubmitAdviceButtonDisabled(newAdvice[0] === "");
    setBannedInputDetected(
      checkForBannedWordsOrSelectSymbols(newAdvice[0]) ||
        checkForBannedWordsOrSelectSymbols(newAdviceGiver || ""),
    );
  };

  const handleSubmitAdvice = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitAdviceButtonDisabled || bannedInputDetected || isSubmitting) {
      return;
    }

    setSubmissionSuccessful(false);
    setSubmissionError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/dadvice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          advice: newAdvice[0],
          giver: newAdvice[1],
          website: honeypotWebsite,
        }),
      });

      if (!response.ok) {
        const friendlyError = await parseSubmissionError(response);
        setSubmissionError(friendlyError);
        return;
      }

      setSubmissionSuccessful(true);
      setNewAdvice(["", ""]);
      setHoneypotWebsite("");
      setSubmitAdviceButtonDisabled(true);
    } catch {
      setSubmissionError(
        "Unable to submit your advice right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
        {loadedAdvice.slice(0, adviceCount).map((advice, index) => (
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
      {loadedAdvice.length > ADVICE_PER_LOAD ? (
        <button
          className={styles["advice-button"]}
          onClick={loadMoreAdvice}
          disabled={adviceCount === loadedAdvice.length && !hasMoreDbAdvice}
        >
          {isFetchingDbAdvice && adviceCount === loadedAdvice.length
            ? "Loading More Advice..."
            : "Load More Advice"}
        </button>
      ) : null}
      {adviceFetchError ? (
        <p className={styles["submit-advice-error-message"]}>
          {adviceFetchError}
        </p>
      ) : null}
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
          onSubmit={handleSubmitAdvice}
        >
          <label className={styles["submit-advice-label"]} htmlFor="advice">
            Advice:
          </label>
          <textarea
            className={styles["submit-advice-textarea"]}
            id="advice"
            placeholder="Give advice here..."
            value={newAdvice[0]}
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
            value={newAdvice[1] || ""}
            onChange={handleAdviceGiverChange}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="advice-website">Website</label>
            <input
              id="advice-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypotWebsite}
              onChange={(e) => setHoneypotWebsite(e.target.value)}
            />
          </div>
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
          {submissionError && !bannedInputDetected ? (
            <p className={styles["submit-advice-error-message"]}>
              {submissionError}
            </p>
          ) : null}
          <button
            className={styles["submit-advice-button"]}
            type="submit"
            disabled={
              submitAdviceButtonDisabled || bannedInputDetected || isSubmitting
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Advice"}
          </button>
        </form>
      </div>
    </main>
  );
}
