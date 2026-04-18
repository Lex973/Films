export class CookieService {
    static set(name: string, value: string, days?: number): void {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
    }

    static get(name: string): string | null {
        const key = `${name}=`;
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(key)) {
                return decodeURIComponent(cookie.substring(key.length));
            }
        }
        return null;
    }
}