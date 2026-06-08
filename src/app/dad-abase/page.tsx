"use client";

import { jokes } from "./data";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import Dadabase from "@/assets/images/dadabase-no-text.png";
import Image from "next/image";
import RandomDads from "../../assets/images/rando-dads-with-arch.webp";

export default function DadAbase() {
  const [loadedJokes, setLoadedJokes] = useState<[string, string][]>(() => [
    ...jokes,
  ]);
  const [jokeCount, setJokeCount] = useState(8);
  const [shownJokes, setShownJokes] = useState(loadedJokes.slice(0, jokeCount));
  const [newJoke, setNewJoke] = useState<[string, string]>(["", ""]);
  const [submitJokeButtonDisabled, setSubmitJokeButtonDisabled] = useState(true);

  const loadMoreJokes = () => {
    if (jokeCount === loadedJokes.length) {
      return;
    }
    if (jokeCount + 8 > loadedJokes.length) {
      setShownJokes(loadedJokes);
      setJokeCount(loadedJokes.length);
      return;
    } else {
      setShownJokes(loadedJokes.slice(0, jokeCount + 8));
      setJokeCount((prevCount) => prevCount + 8);
    }
  };

  const handleJokeSetupChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewJoke((prevJoke) => [e.target.value, prevJoke[1]]);
    setSubmitJokeButtonDisabled(e.target.value === "" || newJoke[1] === "");
  }

  const handleJokePunchlineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewJoke((prevJoke) => [prevJoke[0], e.target.value]);
    setSubmitJokeButtonDisabled(newJoke[0] === "" || e.target.value === "");
  }

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
        {shownJokes.map((joke, index) => (
          <div className={styles["joke-box"]} key={index}>
            <p className={styles["joke"]}>{joke[0]}</p>
            <p className={styles["joke"]}>{joke[1]}</p>
          </div>
        ))}
      </div>
      <button
        className={styles["jokes-button"]}
        onClick={loadMoreJokes}
        disabled={jokeCount === loadedJokes.length}
      >
        Load More Jokes
      </button>
      <div className={styles["submit-joke-outer-div"]}>
        <div className={styles["submit-joke-info-div"]}>
          <h2 className={styles["submit-joke-h2"]}>
            Have a good dad joke for the Dad-abase?
          </h2>
          <p className={styles["submit-joke-p"]}>
            Submit your dad joke to the and help us grow our collection!
          </p>
          <Image
            className={styles["submit-joke-image"]}
            src={RandomDads}
            alt="semi-realistic cartoon of 5 random dads of different ethnicities standing in an arch"
          />
        </div>
        <form
          className={styles["submit-joke-form"]}
          onSubmit={(e) => e.preventDefault()}
        >
          <label className={styles["submit-joke-label"]} htmlFor="joke-setup">
            Joke Setup:
          </label>
          <textarea
            className={styles["submit-joke-textarea"]}
            id="joke-setup"
            placeholder="Enter the joke setup here..."
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
            onChange={handleJokePunchlineChange}
          />
          <button className={styles["submit-joke-button"]} type="submit" disabled={submitJokeButtonDisabled}>
            Submit Joke
          </button>
        </form>
      </div>
    </main>
  );
}
