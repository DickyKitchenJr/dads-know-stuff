"use client";

import { jokes } from "./data";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import Dadabase from "@/assets/images/dadabase-no-text.webp";
import Image from "next/image";
import RandomDads from "../../assets/images/rando-dads-with-arch.webp";
import Link from "next/link";
import { checkForBannedWordsOrSelectSymbols } from "@/helpers/bannedInputs";

const JOKES_PER_LOAD = 8;
const DB_JOKES_BATCH_SIZE = 32;
const PREFETCH_THRESHOLD = 16;

type DadAbaseApiJoke = {
  id: number;
  setup: string;
  punchline: string;
  createdAt: string;
};

const mergeUniqueJokes = (
  existingJokes: [string, string][],
  incomingJokes: [string, string][],
) => {
  const seenJokes = new Set(
    existingJokes.map((joke) => `${joke[0]}::${joke[1]}`),
  );
  const mergedJokes = [...existingJokes];

  for (const joke of incomingJokes) {
    const jokeKey = `${joke[0]}::${joke[1]}`;
    if (!seenJokes.has(jokeKey)) {
      seenJokes.add(jokeKey);
      mergedJokes.push(joke);
    }
  }

  return mergedJokes;
};

export default function DadAbase() {
  const [loadedJokes, setLoadedJokes] = useState<[string, string][]>(() => [
    ...jokes,
  ]);
  const [jokeCount, setJokeCount] = useState(8);
  const [newJoke, setNewJoke] = useState<[string, string]>(["", ""]);
  const [submitJokeButtonDisabled, setSubmitJokeButtonDisabled] =
    useState(true);
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bannedInputDetected, setBannedInputDetected] = useState(false);
  const [honeypotWebsite, setHoneypotWebsite] = useState("");
  const [dbSkip, setDbSkip] = useState(0);
  const [hasMoreDbJokes, setHasMoreDbJokes] = useState(true);
  const [isFetchingDbJokes, setIsFetchingDbJokes] = useState(false);
  const [jokesFetchError, setJokesFetchError] = useState("");

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
      return "Unable to submit your joke right now. Please try again.";
    }

    return "Unable to submit your joke right now. Please try again.";
  };

  const fetchMoreDbJokes = useCallback(async () => {
    if (isFetchingDbJokes || !hasMoreDbJokes) {
      return;
    }

    setIsFetchingDbJokes(true);

    try {
      const response = await fetch(
        `/api/dad-abase?skip=${dbSkip}&take=${DB_JOKES_BATCH_SIZE}`,
      );

      if (!response.ok) {
        setJokesFetchError("Unable to load more jokes right now.");
        setHasMoreDbJokes(false);
        return;
      }

      const payload = (await response.json()) as { jokes?: DadAbaseApiJoke[] };
      const incomingJokes = (payload.jokes ?? []).map(
        (joke) => [joke.setup, joke.punchline] as [string, string],
      );

      setLoadedJokes((prevJokes) => mergeUniqueJokes(prevJokes, incomingJokes));
      setDbSkip((prevSkip) => prevSkip + incomingJokes.length);
      setJokesFetchError("");

      if (incomingJokes.length < DB_JOKES_BATCH_SIZE) {
        setHasMoreDbJokes(false);
      }
    } catch {
      setJokesFetchError("Unable to load more jokes right now.");
      setHasMoreDbJokes(false);
    } finally {
      setIsFetchingDbJokes(false);
    }
  }, [dbSkip, hasMoreDbJokes, isFetchingDbJokes]);

  useEffect(() => {
    if (
      dbSkip === 0 &&
      hasMoreDbJokes &&
      !isFetchingDbJokes &&
      !jokesFetchError
    ) {
      void fetchMoreDbJokes();
    }
  }, [
    dbSkip,
    fetchMoreDbJokes,
    hasMoreDbJokes,
    isFetchingDbJokes,
    jokesFetchError,
  ]);

  useEffect(() => {
    const remainingVisibleJokes = loadedJokes.length - jokeCount;

    if (
      remainingVisibleJokes <= PREFETCH_THRESHOLD &&
      hasMoreDbJokes &&
      !isFetchingDbJokes &&
      !jokesFetchError
    ) {
      void fetchMoreDbJokes();
    }
  }, [
    fetchMoreDbJokes,
    hasMoreDbJokes,
    isFetchingDbJokes,
    jokeCount,
    jokesFetchError,
    loadedJokes.length,
  ]);

  const loadMoreJokes = () => {
    if (jokeCount >= loadedJokes.length) {
      return;
    }

    setJokeCount((prevCount) =>
      Math.min(prevCount + JOKES_PER_LOAD, loadedJokes.length),
    );
  };

  const handleJokeSetupChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSetup = e.target.value;
    setNewJoke((prevJoke) => [newSetup, prevJoke[1]]);
    setSubmitJokeButtonDisabled(newSetup === "" || newJoke[1] === "");
    setBannedInputDetected(
      checkForBannedWordsOrSelectSymbols(newSetup) ||
        checkForBannedWordsOrSelectSymbols(newJoke[1]),
    );
  };

  const handleJokePunchlineChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newPunchline = e.target.value;
    setNewJoke((prevJoke) => [prevJoke[0], newPunchline]);
    setSubmitJokeButtonDisabled(newJoke[0] === "" || newPunchline === "");
    setBannedInputDetected(
      checkForBannedWordsOrSelectSymbols(newJoke[0]) ||
        checkForBannedWordsOrSelectSymbols(newPunchline),
    );
  };

  const handleSubmitJoke = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitJokeButtonDisabled || bannedInputDetected || isSubmitting) {
      return;
    }

    setSubmissionSuccessful(false);
    setSubmissionError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/dad-abase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setup: newJoke[0],
          punchline: newJoke[1],
          website: honeypotWebsite,
        }),
      });

      if (!response.ok) {
        const friendlyError = await parseSubmissionError(response);
        setSubmissionError(friendlyError);
        return;
      }

      setSubmissionSuccessful(true);
      setNewJoke(["", ""]);
      setHoneypotWebsite("");
      setSubmitJokeButtonDisabled(true);
    } catch {
      setSubmissionError(
        "Unable to submit your joke right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles["main"]}>
      <NavBar />
      <Header
        title="DAD-ABASE"
        subtitle="Cheesy, cringy, and everything that makes dad jokes great!"
        logoSrc={Dadabase}
        logoAlt="laughing emoji face"
      />
      <div className={styles["jokes-container"]}>
        {loadedJokes.slice(0, jokeCount).map((joke, index) => (
          <div className={styles["joke-box"]} key={index}>
            <p className={styles["joke"]}>{joke[0]}</p>
            <p className={styles["joke"]}>{joke[1]}</p>
          </div>
        ))}
      </div>
      {jokesFetchError ? (
        <p className={styles["submit-joke-error-message"]}>{jokesFetchError}</p>
      ) : null}
      <button
        className={styles["jokes-button"]}
        onClick={loadMoreJokes}
        disabled={jokeCount === loadedJokes.length && !hasMoreDbJokes}
      >
        {isFetchingDbJokes && jokeCount === loadedJokes.length
          ? "Loading More Jokes..."
          : "Load More Jokes"}
      </button>
      <div className={styles["submit-joke-outer-div"]}>
        <div className={styles["submit-joke-info-div"]}>
          <h2 className={styles["submit-joke-h2"]}>
            Have a good dad joke for the Dad-abase?
          </h2>
          <p className={styles["submit-joke-p"]}>
            Submit your dad joke and help us grow our collection!
            <br />
            Please review our{" "}
            <Link href="/privacy-usage">Privacy & Usage Policy</Link> before
            submitting. By submitting, you are agreeing to them.
          </p>
          <Image
            className={styles["submit-joke-image"]}
            src={RandomDads}
            alt="semi-realistic cartoon of 5 random dads of different ethnicities standing in an arch"
          />
        </div>
        <form
          className={styles["submit-joke-form"]}
          onSubmit={handleSubmitJoke}
        >
          <label className={styles["submit-joke-label"]} htmlFor="joke-setup">
            Joke Setup:
          </label>
          <textarea
            className={styles["submit-joke-textarea"]}
            id="joke-setup"
            placeholder="Enter the joke setup here..."
            value={newJoke[0]}
            onChange={handleJokeSetupChange}
          />
          <label
            className={styles["submit-joke-label"]}
            htmlFor="joke-punchline"
          >
            Joke Punchline:
          </label>
          <textarea
            className={styles["submit-joke-textarea"]}
            id="joke-punchline"
            placeholder="Enter the joke punchline here..."
            value={newJoke[1]}
            onChange={handleJokePunchlineChange}
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
            <label htmlFor="joke-website">Website</label>
            <input
              id="joke-website"
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
              The Council of Dads will review the dad joke, and if it meets our
              guidelines we will add it to the page and it will be visible to
              everyone. Thank you for your submission.
            </p>
          )}
          {bannedInputDetected ? (
            <p className={styles["submit-joke-error-message"]}>
              We ban certain words and symbols from our inputs to prevent misuse
              of our site. Please remove any inappropriate language and symbols
              and try again.
            </p>
          ) : null}
          {submissionError && !bannedInputDetected ? (
            <p className={styles["submit-joke-error-message"]}>
              {submissionError}
            </p>
          ) : null}
          <button
            className={styles["submit-joke-button"]}
            type="submit"
            disabled={
              submitJokeButtonDisabled || bannedInputDetected || isSubmitting
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Joke"}
          </button>
        </form>
      </div>
    </main>
  );
}
