/**
 * Zod error message formatter
 *
 * @param {Record<string, Record<string, string[]?>>} issues
 */
export const zodErrorFormatter = (issues) => {
  const errors = {};

  for (const [key, value] of Object.entries(issues)) {
    if (key !== "_errors") {
      errors[key] = value._errors[0];
    }
  }

  return errors;
};
