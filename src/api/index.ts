/* eslint-disable @typescript-eslint/camelcase */

import {
    HeadlineOptions,
    HeadlineResponse,
    Headline,
    ScanOptions,
    ScanResponse,
    LoginOptions,
    LoginResponse,
    TicketResponse,
    WatchListsResponse,
    WatchListsItem,
    SetWatchListOptions
} from "../type";
import { Subdomain, Locale, Market, HeadlineCategory } from "../enum";
import client from "./client";
import Sentiment from "../services/sentiment";

class TradingViewApi {
    static client = client.client;

    static async headlines({
        locale = Locale.English,
        category = HeadlineCategory.Stock,
        ...options
    }: HeadlineOptions): Promise<HeadlineResponse> {
        const headlines = await client.get<HeadlineResponse>({
            subdomain: Subdomain.News,
            path: "/headlines/yahoo/",
            params: {
                locale,
                category,
                ...options
            },
            isCached: true
        });
        return headlines.map(({ shortDescription, ...headline }: Headline) => {
            const { score: sentiment } = Sentiment.get(shortDescription);
            return {
                ...headline,
                shortDescription,
                sentiment
            };
        });
    }

    static scan({
        market = Market.America,
        config,
        ...options
    }: ScanOptions): Promise<ScanResponse> {
        return client.get<ScanResponse>({
            subdomain: Subdomain.Scanner,
            path: `/${market}/scan`,
            params: options as { [key: string]: string },
            form: config
        });
    }

    static login(config: LoginOptions): Promise<LoginResponse> {
        return client.post<LoginResponse>({
            path: "/accounts/signin/",
            form: { ...config, feature_source: "Header" }
        });
    }

    static async logout(): Promise<boolean> {
        if (client.hasSession) {
            await client.post<void>({
                path: "/accounts/logout/"
            });
            client.clearSession();
            return true;
        }
        return false;
    }

    static tickets(): Promise<TicketResponse> {
        return client.get<TicketResponse>({
            subdomain: Subdomain.Middleware,
            path: "/api/v1/tickets/count_by_userid"
        });
    }

    static watchlists(): Promise<WatchListsResponse> {
        return client.get<WatchListsResponse>({
            path: "/api/v1/symbols_list/custom/"
        });
    }

    static watchlist(id: number): Promise<WatchListsItem> {
        return client.get<WatchListsItem>({
            path: `/api/v1/symbols_list/custom/${id}`
        });
    }

    static setWatchlist(config: SetWatchListOptions): Promise<WatchListsItem | void> {
        if (client.hasSession) {
            return client.post<WatchListsItem>({
                path: "/api/v1/symbols_list/custom/",
                data: config
            });
        }
        return Promise.resolve();
    }
}

export default TradingViewApi;
