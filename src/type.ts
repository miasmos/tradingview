/* eslint-disable camelcase */

import { HeadlineCategory, Locale, Market } from "./enum";

interface Form {
    [key: string]: string | number;
}

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

// Login
export interface LoginOptions extends Form {
    username: string;
    password: string;
}

export interface LoginNotificationCount {
    following: number;
    user: number;
}

export interface LoginBadges {
    name: string;
    verbose_name: string;
}

export interface LoginUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    has_email: boolean;
    date_joined: string;
    userpic: string;
    userpic_mid: string;
    userpic_big: string;
    status: string;
    private_channel: string;
    session_hash: string;
    saved_charts: number;
    published_charts: number;
    notification_popup: boolean;
    notification_sound: boolean;
    notification_count: LoginNotificationCount;
    following: number;
    followers: number;
    reputation: number;
    max_user_language_restriction: number;
    has_stocktwits: boolean;
    has_twitter: boolean;
    has_youtube: boolean;
    is_first_login: boolean;
    ignore_list: unknown;
    pub_chat_post_permission: boolean;
    is_broker: boolean;
    badges: LoginBadges;
    permissions: unknown;
    pub_chat_post_permission_time: null | string;
    pub_chat_post_permission_delay_seconds: null | number;
    is_staff: boolean;
    is_superuser: boolean;
    is_moderator: boolean;
    settings: unknown;
    auth_token: string;
    alerts_offline_data: unknown;
    social_registration: boolean;
    has_phone: boolean;
    referral_session_id: null | string;
    sms_email: null | string;
    after_trial: null | string;
    is_policy_accepted: boolean;
    is_non_pro_confirmed: boolean;
    do_not_track: boolean;
    is_pro: boolean;
    is_trial: boolean;
    is_pro_limited: boolean;
    pro_being_cancelled: null | boolean;
    pro_plan_days_left: number;
    pro_plan_original_name: null | string;
    pro_plan: string;
    pro_plan_billing_cycle: null | string;
    trial_days_left: number;
    trial_days_left_text: string;
    new_pro_product_line: null | string;
    available_offers: unknown;
    withheld: boolean;
    had_pro: boolean;
    gsfn_fastpass_url: string;
    top_user_info: null;
    picture_url: string;
}

export interface LoginResponse {
    error: string;
    user: LoginUser;
}

// Ticket
export interface TicketResponse {
    ticketsCount: number;
}

// Watchlists
export interface WatchListsItem {
    active: boolean;
    color: string | null;
    created: string;
    id: number;
    legacy_id: string;
    modified: string;
    name: string;
    shared: boolean;
    symbols: string[];
    type: string;
}
export type WatchListsResponse = WatchListsItem[];
export interface SetWatchListOptions {
    name: string;
    symbols: string[];
}
