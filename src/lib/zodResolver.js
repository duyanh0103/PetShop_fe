/**
 * Minimal react-hook-form resolver for Zod schemas.
 *
 * We don't depend on @hookform/resolvers (not installed) — this mirrors its
 * zodResolver behavior closely enough for our forms: safeParse the values,
 * and on failure map the first issue per field path into RHF's error shape.
 */
export function zodResolver(schema) {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const errors = result.error.issues.reduce((accumulator, issue) => {
      const path = issue.path.join(".");

      if (!path || accumulator[path]) {
        return accumulator;
      }

      accumulator[path] = {
        type: issue.code,
        message: issue.message,
      };

      return accumulator;
    }, {});

    return {
      values: {},
      errors,
    };
  };
}

export default zodResolver;
