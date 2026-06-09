"use client";

import NavBar from "@/components/NavBar";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Dadgram from "@/assets/images/dadgram-no-text.png";
import Image from "next/image";
import { useState, type FormEvent } from "react";

export default function DadGram() {
  const [sendersName, setSendersName] = useState("");
  const [receiversName, setReceiversName] = useState("");
  const [createDadGramButtonDisabled, setCreateDadGramButtonDisabled] =
    useState(true);
  const [createdDadGramLink, setCreatedDadGramLink] = useState("");

  const handleSendersNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendersName(e.target.value);
    setCreateDadGramButtonDisabled(
      e.target.value === "" || receiversName === "",
    );
  };

  const handleReceiversNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setReceiversName(e.target.value);
    setCreateDadGramButtonDisabled(e.target.value === "" || sendersName === "");
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
          <h2 className={styles["dad-gram-h2"]}>CREATE A DAD-GRAM</h2>
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
                Link copied. You can paste it into an email or text message:
                <br />
                {createdDadGramLink}
              </p>
            ) : null}
          </form>
        </div>
        <div className={styles["example-dad-gram-div"]}>
          <h2 className={styles["dad-gram-h2"]}>EXAMPLE DAD-GRAM</h2>
        </div>
      </div>
    </main>
  );
}
