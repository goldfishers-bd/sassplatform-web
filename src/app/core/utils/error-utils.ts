import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(err: HttpErrorResponse | any, fallback: string): string {
    const fieldErrors = err?.error?.errors;
    if (fieldErrors && typeof fieldErrors === 'object') {
        const firstKey = Object.keys(fieldErrors)[0];
        const firstMessage = fieldErrors[firstKey];
        if (Array.isArray(firstMessage) && firstMessage.length > 0) {
            return firstMessage[0];
        }
    }
    return err?.error?.title ?? fallback;
}