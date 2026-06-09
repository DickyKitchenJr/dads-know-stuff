import NavBar from "@/components/NavBar";
import styles from "./page.module.css";

type MessagePageProps = {
  params: Promise<{
    sendersName: string;
    receiversName: string;
  }>;
};

export default async function Message({ params }: MessagePageProps) {
  const { sendersName, receiversName } = await params;

  return (
    <main className={styles["main"]}>
      <NavBar />
      {sendersName === "undefined" || receiversName === "undefined" ? (
        <p className={styles["error-message"]}>
          Oops! It looks like the link you used is missing some information. Please make sure the link is in the correct format and try again.
        </p>
      ) : (
        <>
          <h2>Message Page</h2>
          <p>
            From {decodeURIComponent(sendersName)} to{" "}
            {decodeURIComponent(receiversName)}
          </p>
        </>
      )}
    </main>
  );
}
