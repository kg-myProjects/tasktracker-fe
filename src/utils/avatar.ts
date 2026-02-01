import md5 from "md5";


export function generateAvatar(email: string, size = 80): string{
    if (!email)return `https://gravatar.com/avatar/?d=${size}`;
    const hash = md5(email.trim().toLowerCase());
    return `https://gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
}