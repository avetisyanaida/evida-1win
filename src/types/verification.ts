export interface VerificationUser {
    id: string;
    email: string | null;
    phone: string | null;
    verifiedEmail: boolean;
    verifiedPhone?: boolean;
}
