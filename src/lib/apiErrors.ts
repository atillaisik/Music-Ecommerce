import { PostgrestError } from '@supabase/supabase-js';

export type ApiErrorCode =
    | 'unauthenticated'
    | 'forbidden'
    | 'not_found'
    | 'conflict'
    | 'validation'
    | 'network'
    | 'unknown';

export interface ApiError {
    code: ApiErrorCode;
    message: string;
    details?: string;
}

const POSTGRES_CODES: Record<string, ApiErrorCode> = {
    '23505': 'conflict',
    '23503': 'validation',
    '23514': 'validation',
    '42501': 'forbidden',
    '42P01': 'unknown',
    'PGRST301': 'forbidden',
    'PGRST116': 'not_found',
};

export const mapSupabaseError = (err: unknown): ApiError => {
    if (!err) {
        return { code: 'unknown', message: 'An unknown error occurred.' };
    }

    if (typeof err === 'object' && err !== null && 'code' in err) {
        const pg = err as PostgrestError;
        const code = POSTGRES_CODES[pg.code] ?? 'unknown';
        const message = pg.message || 'Database error';

        if (code === 'forbidden') {
            return {
                code,
                message: 'You do not have permission to perform this action.',
                details: message,
            };
        }
        if (code === 'conflict') {
            return {
                code,
                message: 'A record with these details already exists.',
                details: message,
            };
        }
        if (code === 'validation') {
            return { code, message, details: pg.details ?? undefined };
        }
        return { code, message, details: pg.details ?? undefined };
    }

    if (err instanceof Error) {
        const m = err.message ?? '';
        if (/not authenticated/i.test(m)) {
            return { code: 'unauthenticated', message: 'You must be signed in.' };
        }
        if (/network|fetch/i.test(m)) {
            return { code: 'network', message: 'Network error. Please retry.' };
        }
        return { code: 'unknown', message: m || 'Unexpected error.' };
    }

    return { code: 'unknown', message: String(err) };
};
