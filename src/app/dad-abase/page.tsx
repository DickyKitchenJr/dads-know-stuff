"use client";

import { jokes } from "./data";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import NavBar from "@/components/NavBar";

export default function DadAbase() {
const [loadedJokes, setLoadedJokes] = useState<string[]>(() => [...jokes]);

  return (
    <main className={styles["main"]}>
      <NavBar />
    </main>
  );
}
