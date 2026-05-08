import Image from "next/image";
import smallLogo from "../assets/images/dads-know-stuff-small-logo.webp";
import heroImage from "../assets/images/rando-dads-with-arch.webp";

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontFamily: "var(--font-fredericka)" }}>
        Image usage examples
      </h1>

      <Image
        src={heroImage}
        alt="A group of dads under an arch"
        priority
        sizes="(max-width: 900px) 100vw, 808px"
        style={{ width: "100%", maxWidth: "808px", height: "auto" }}
      />

      <Image
        src={smallLogo}
        alt="Dads Know Stuff small logo"
        sizes="96px"
        quality={75}
        style={{ width: "96px", height: "auto", marginTop: "1rem" }}
      />
    </main>
  );
}
