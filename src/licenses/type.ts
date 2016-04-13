'use script';

export interface License {
    year: string;
    author: string;
    termsAndConditions(): string;
    header(): string;
}