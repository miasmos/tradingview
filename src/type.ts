import { HeadlineCategory, Locale, Market } from "./enum";

// Headlines
export interface Headline {
    id: string;
    link: string;
    title: string;
    shortDescription: string;
    published: number;
    source: string;
    sentiment?: number;
}

export interface HeadlineOptions {
    category?: HeadlineCategory;
    proSymbol?: string;
    locale?: Locale;
}

export type HeadlineResponse = Headline[];

// Scan
export interface ScanData {
    s: string;
    d: (string | number)[];
}

interface ScanFilterItem {
    left: string;
    operation: string;
    right: string[] | number | number[];
}
interface ScanOptionItem {
    lang: string;
}
interface ScanSymbols {
    query: {
        types: string[];
    };
    tickers: string[];
}
interface ScanSort {
    sortBy: string;
    sortOrder: string;
}

export interface ScanConfig {
    filter: ScanFilterItem[];
    options: ScanOptionItem;
    symbols: ScanSymbols;
    columns: string[];
    sort: ScanSort;
}

export interface ScanOptions {
    config: ScanConfig;
    market?: Market;
}

export interface ScanResponse {
    totalCount: number;
    data: ScanData[];
}
