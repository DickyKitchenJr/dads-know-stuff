import NavBar from "@/components/NavBar";
import Header from "@/components/Header";
import styles from "./page.module.css";
import { checkForBannedWordsOrSymbols } from "@/helpers/bannedInputs";

type MessagePageProps = {
  params: Promise<{
    sendersName: string;
    receiversName: string;
  }>;
};

export default async function Message({ params }: MessagePageProps) {
  const { sendersName, receiversName } = await params;
  const sender=decodeURIComponent(sendersName);
  const receiver=decodeURIComponent(receiversName);
  const bannedInputDetected = checkForBannedWordsOrSymbols(sender) || checkForBannedWordsOrSymbols(receiver);

  return (
    <main className={styles["main"]}>
      <NavBar />
      {bannedInputDetected || sender === undefined || receiver === undefined ? (
        <p className={styles["message-p"]}>
          Oops! It looks like the link you used is missing some information.
          Please make sure the link is in the correct format and try again.
        </p>
      ) : (
        <>
          <Header title={receiver} subtitle="You Have Been Recognized." />
          <div className={styles["message-div"]}>
            <h2 className={styles["message-h2"]}>A Truly Remarkable Dad</h2>
            <p className={styles["message-p"]}>
              It has come to our attention that you, {receiver}, are an amazing
              dad.
            </p>
            <p className={styles["message-p"]}>
              According to {sender}, your contributions and efforts as a dad
              have not gone unnoticed and they wanted to make sure you received
              the recognition you deserve.
            </p>
            <p className={styles["message-p"]}>
              We want you to know the Council of Dads appreciates your
              dedication and the positive impact you have on your family and
              community.
            </p>
            <p className={styles["message-p"]}>
              Dads Know Stuff was created because of incredible dads like you,
              and we are grateful to {sender} for recognizing your efforts.
            </p>
            <p className={styles["message-p"]}>A dad is one who leads by example and with patience. They know strength comes from the heart and mind just as much as from the body. A dad feels joy and love when their children succeed, and is there for them when they stumble. They know when to be gentle, and how to guide with wisdom and love. A true dad is a stable and safe fixture in their children's lives.</p>
            <p className={styles["message-p"]}>{sender} believes you, {receiver}, are such a dad, and they wanted to make sure you knew it.</p>
            <p className={styles["message-p"]}>
              Keep being the amazing dad that you are, and know that you are
              valued and appreciated by those around you.
            </p>
            <p className={styles["message-p"]}>The Council of Dads sees you, and recognizes a fellow hero.</p>
          </div>
        </>
      )}
    </main>
  );
}
