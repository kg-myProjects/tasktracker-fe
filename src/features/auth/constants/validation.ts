/**
 * Frontend validation rules.
 *
 * These rules must stay synchronized with backend UserCreateDto validation.
 */
export const EMAIL_REGEX =
    /^(?=.{6,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;

export const PASSWORD_REQUIREMENTS = [
    {
        regex: /.{8,}/,
        message: "At least 8 characters",
    },
    {
        regex: /\p{Lu}/u,
        message: "One uppercase letter",
    },
    {
        regex: /\p{Ll}/u,
        message: "One lowercase letter",
    },
    {
        regex: /\d/,
        message: "One number",
    },
    {
        regex: /[^\p{L}\p{N}]/u,
        message: "One special character",
    },
] as const;