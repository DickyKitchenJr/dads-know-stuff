import {
  checkForBannedWords,
  checkForBannedSymbols,
  checkForBannedWordsOrSymbols,
} from "../bannedInputs";

describe("checkForBannedWords", () => {
  it("should detect exact banned word match", () => {
    expect(checkForBannedWords("hello shit world")).toBe(true);
  });

  it("should detect banned word between repeated letters", () => {
    expect(checkForBannedWords("kissmyhassh")).toBe(true);
  });

  it("should return false for clean input", () => {
    expect(checkForBannedWords("hello hashtag world")).toBe(false);
  });
});

describe("checkForBannedSymbols", () => {
  it("should detect symbols in input", () => {
    expect(checkForBannedSymbols("hello@world")).toBe(true);
  });

  it("should return false for letter-only input", () => {
    expect(checkForBannedSymbols("helloworld")).toBe(false);
  });
});

describe("checkForBannedWordsOrSymbols", () => {
  it("should detect banned words or symbols in input", () => {
    expect(
      checkForBannedWordsOrSymbols(
        "hello darkness my old friend it appears shit has hit the fan again",
      ),
    ).toBe(true);
    expect(
      checkForBannedWordsOrSymbols(
        "just another sh1t way to sneak in a curse word",
      ),
    ).toBe(true);
  });

  it("should return false for clean input", () => {
    expect(
      checkForBannedWordsOrSymbols("dads are awesome and deserve love"),
    ).toBe(false);
  });
});
