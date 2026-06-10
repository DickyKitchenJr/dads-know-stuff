"use client";

import NavBar from "@/components/NavBar";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Dadgram from "@/assets/images/dadgram-no-text.png";
import { useState, type FormEvent } from "react";
import { checkForBannedWordsOrSymbols } from "@/helpers/bannedInputs";

export default function DadGram() {
  const [sendersName, setSendersName] = useState("");
  const [receiversName, setReceiversName] = useState("");
  const [createDadGramButtonDisabled, setCreateDadGramButtonDisabled] =
    useState(true);
  const [createdDadGramLink, setCreatedDadGramLink] = useState("");
  const [bannedInputDetected, setBannedInputDetected] = useState(false);

  const handleSendersNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendersName(e.target.value);
    setCreateDadGramButtonDisabled(
      e.target.value === "" || receiversName === "" || checkForBannedWordsOrSymbols(e.target.value) || checkForBannedWordsOrSymbols(receiversName)
    );
    setBannedInputDetected(checkForBannedWordsOrSymbols(e.target.value) || checkForBannedWordsOrSymbols(receiversName));
  };

  const handleReceiversNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setReceiversName(e.target.value);
    setCreateDadGramButtonDisabled(
      e.target.value === "" || sendersName === "" || checkForBannedWordsOrSymbols(e.target.value) || checkForBannedWordsOrSymbols(sendersName)
    );
    setBannedInputDetected(checkForBannedWordsOrSymbols(e.target.value) || checkForBannedWordsOrSymbols(sendersName));
  };

  const handleCreateDadGram = async () => {
    const encodedSendersName = encodeURIComponent(sendersName);
    const encodedReceiversName = encodeURIComponent(receiversName);
    const dadGramLink = `${window.location.origin}/dad-gram/message/${encodedSendersName}/${encodedReceiversName}`;
    setCreatedDadGramLink(dadGramLink);

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(dadGramLink);
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleCreateDadGram();
  };

  return (
    <main className={styles["main"]}>
      <NavBar />
      <Header
        title="DAD-GRAM"
        subtitle="Create a custom link and show dad some love!"
        logoSrc={Dadgram}
        logoAlt="a drawing of a paper airplane symbolizing sending a message"
      />
      <div className={styles["dad-gram-outer-div"]}>
        <div className={styles["create-dad-gram-div"]}>
          <h2 className={styles["dad-gram-h2"]}>CREATE A DAD-GRAM:</h2>
          <form
            className={styles["create-dad-gram-form"]}
            onSubmit={handleFormSubmit}
          >
            <label
              className={styles["create-dad-gram-label"]}
              htmlFor="joke-setup"
            >
              YOUR NAME:
            </label>
            <input
              className={styles["create-dad-gram-textarea"]}
              id="joke-setup"
              placeholder="Enter Sender's Name"
              onChange={handleSendersNameChange}
            />
            <label
              className={styles["create-dad-gram-label"]}
              htmlFor="joke-punchline"
            >
              RECEIVING DAD'S NAME:
            </label>
            <input
              className={styles["create-dad-gram-textarea"]}
              id="joke-punchline"
              placeholder="Enter Receiving Dad's Name"
              onChange={handleReceiversNameChange}
            />
            <button
              className={styles["create-dad-gram-button"]}
              type="submit"
              disabled={createDadGramButtonDisabled}
            >
              CREATE LINK
            </button>
            {createdDadGramLink ? (
              <p className={styles["create-dad-gram-success-message"]}>
                Link copied.
                <br />
                You can now paste it into an email or text message and send it
                to the receiving dad!
                <br />
                <span className={styles["create-dad-gram-link"]}>Link: {createdDadGramLink}</span>
              </p>
            ) : null}
            {bannedInputDetected ? (
              <p className={styles["create-dad-gram-error-message"]}>
                We ban certain words and symbols from our inputs to prevent
                misuse of our site. Please remove any inappropriate language and
                try again.
              </p>
            ) : null}
          </form>
        </div>
        <div className={styles["example-dad-gram-div"]}>
          <h2
            className={`${styles["dad-gram-h2"]} ${styles["add-margin-top"]}`}
          >
            EXAMPLE DAD-GRAM:
          </h2>
          <div className={styles["example-dad-gram-message-div"]}>
            <p className={styles["example-dad-gram-message-title"]}>
              A Truly Remarkable Dad
            </p>
            <p className={styles["example-dad-gram-message-p"]}>
              It has come to our attention that you,{" "}
              <span className={styles["example-dad-gram-message-name"]}>
                INSERT NAME
              </span>
              , are an amazing dad.
            </p>
            <p className={styles["example-dad-gram-message-p"]}>
              According to{" "}
              <span className={styles["example-dad-gram-message-name"]}>
                INSERT NAME
              </span>
              , your contributions and efforts as a dad have not gone unnoticed
              and they wanted to make sure you received the recognition you
              deserve.
            </p>
            <p className={styles["example-dad-gram-message-p"]}>
              We want you to know the Council of Dads appreciates your
              dedication and the positive impact you have on your family and
              community.
            </p>
            <p className={styles["example-dad-gram-message-p"]}>
              Dads Know Stuff was created because of incredible dads like you,
              and we are grateful to{" "}
              <span className={styles["example-dad-gram-message-name"]}>
                INSERT NAME
              </span>{" "}
              for recognizing your efforts.
            </p>
            <p className={styles["example-dad-gram-message-p"]}>
              A dad is one who leads by example and with patience. They know
              strength comes from the heart and mind just as much as from the
              body. A dad feels joy and love when their children succeed, and is
              there for them when they stumble. They know when to be gentle, and
              how to guide with wisdom and love. A true dad is a stable and safe
              fixture in their children's lives.
            </p>
            <p className={styles["example-dad-gram-message-p"]}>
              <span className={styles["example-dad-gram-message-name"]}>
                INSERT NAME
              </span>{" "}
              believes you,{" "}
              <span className={styles["example-dad-gram-message-name"]}>
                INSERT NAME
              </span>
              , are such a dad, and they wanted to make sure you knew it.
            </p>
            <p className={styles["example-dad-gram-message-p"]}>
              Keep being the amazing dad that you are, and know that you are
              valued and appreciated by those around you.
            </p>
            <p className={styles["example-dad-gram-message-p"]}>
              The Council of Dads sees you, and recognizes a fellow hero.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
