export interface NameValidationResult {
  isValid: boolean;
  error?: string;
  cleanedName: string;
}

const BANNED_PLACEHOLDER_WORDS = new Set([
  "test",
  "testing",
  "tester",
  "user",
  "admin",
  "administrator",
  "demo",
  "sample",
  "asdf",
  "asdfg",
  "qwerty",
  "fake",
  "temp",
  "dummy",
  "anonymous",
  "anon",
  "nobody",
  "someone",
  "placeholder",
  "example",
  "unknown",
  "myname",
  "name",
  "firstname",
  "lastname",
  "null",
  "undefined",
  "default",
]);

/**
 * Validates human full names with strict redundancy and spam detection.
 * Enforces:
 * 1. Non-empty, 3-60 characters
 * 2. Valid letters, hyphens, apostrophes, and period for initials
 * 3. No consecutive repetitive characters (e.g. "Dyyyyylan", "Raaamos")
 * 4. At least 2 distinct words (First and Last name)
 * 5. No redundant/repeated words (e.g. "Dylan Dylan", "Ramos Ramos", "Dylan Ramos Dylan")
 * 6. No dummy/placeholder spam words (e.g. "test test", "demo user")
 */
export function validateStrictName(rawName: string): NameValidationResult {
  if (!rawName || typeof rawName !== "string") {
    return {
      isValid: false,
      error: "Full name is required.",
      cleanedName: "",
    };
  }

  // 1. Clean and normalize spaces and trim
  const cleanedName = rawName.trim().replace(/\s+/g, " ");

  // 2. Length constraints
  if (cleanedName.length < 3) {
    return {
      isValid: false,
      error: "Name must be at least 3 characters long.",
      cleanedName,
    };
  }

  if (cleanedName.length > 60) {
    return {
      isValid: false,
      error: "Name cannot exceed 60 characters.",
      cleanedName,
    };
  }

  // 3. Allowed characters: letters (including unicode accents), spaces, hyphens, apostrophes, and periods (for initials/suffixes like Jr.)
  const validCharRegex = /^[a-zA-ZÀ-ÿ\s'\-\.]+$/;
  if (!validCharRegex.test(cleanedName)) {
    return {
      isValid: false,
      error: "Name contains invalid characters. Numbers and special symbols are not allowed.",
      cleanedName,
    };
  }

  // 4. Check for repetitive characters (e.g., "Dyyyyylan", "Raaamooos", "Johnnn")
  // 3 or more consecutive identical characters
  if (/(.)\1{2,}/i.test(cleanedName)) {
    return {
      isValid: false,
      error: "Name contains redundant repetitive characters (e.g. 'aaa').",
      cleanedName,
    };
  }

  // 5. Must contain at least two words (First name and Last name)
  const words = cleanedName.split(" ").filter(Boolean);
  if (words.length < 2) {
    return {
      isValid: false,
      error: "Please enter your complete full name (both first and last name).",
      cleanedName,
    };
  }

  // 6. Check word lengths (each word must have at least 1 valid char, and at least one word must have >= 2 chars)
  for (const word of words) {
    const strippedWord = word.replace(/[\.\-']/g, "");
    if (strippedWord.length === 0) {
      return {
        isValid: false,
        error: "Name contains invalid or empty word segments.",
        cleanedName,
      };
    }
  }

  const hasSubstantialWord = words.some(
    (w) => w.replace(/[\.\-']/g, "").length >= 2
  );
  if (!hasSubstantialWord) {
    return {
      isValid: false,
      error: "Please enter your full name (names cannot consist of only single letters).",
      cleanedName,
    };
  }

  // 7. Check for duplicate or redundant words (e.g. "Dylan Dylan", "Ramos Ramos", "Dylan Ramos Dylan")
  const normalizedWords = words.map((w) =>
    w.toLowerCase().replace(/[\.\-']/g, "")
  );

  const seen = new Set<string>();
  for (const word of normalizedWords) {
    if (seen.has(word)) {
      return {
        isValid: false,
        error: `Redundant name detected: "${word}" is repeated. Please provide a distinct first and last name.`,
        cleanedName,
      };
    }
    seen.add(word);
  }

  // 8. Check for placeholder / dummy / test names
  for (const word of normalizedWords) {
    if (BANNED_PLACEHOLDER_WORDS.has(word)) {
      return {
        isValid: false,
        error: "Please enter a valid real name instead of a placeholder or test name.",
        cleanedName,
      };
    }
  }

  return {
    isValid: true,
    cleanedName,
  };
}
