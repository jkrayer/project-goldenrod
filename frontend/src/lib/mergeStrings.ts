import { compose, filter, isNotNil, join, replace, trim } from "ramda";

/**
 * 1. This is necessary because typescript doesn't understand ramda's types
 * when composed as one function.
 */
const removeNil = filter<string | undefined | null, string>(isNotNil); // 1.

/**
 * Merges an array of strings (which may contain null or undefined values) into a single string.
 *
 * The function performs the following operations in sequence:
 * 1. Filters out null and undefined values from the input array
 * 2. Joins the remaining strings with a space separator
 * 3. Trims leading and trailing whitespace
 * 4. Replaces multiple consecutive spaces with a single space
 *
 * @param strings - An array of strings that may contain null or undefined values
 * @returns A single merged and normalized string
 *
 * @example
 * ```typescript
 * mergeStrings(['Hello', null, 'World', undefined, '!'])
 * // Returns: "Hello World !"
 *
 * mergeStrings(['  foo  ', 'bar  ', '  baz  '])
 * // Returns: "foo bar baz"
 * ```
 */ export const mergeStrings = compose<
  [Array<string | undefined | null>],
  string[],
  string,
  string,
  string
>(replace(/\s{2,}/g, " "), trim, join(" "), removeNil);
