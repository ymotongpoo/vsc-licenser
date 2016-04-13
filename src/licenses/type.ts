'use script';

export interface License {
    year: string;
    author: string;
    termsAndCondition(): string;
    header(): string;
}