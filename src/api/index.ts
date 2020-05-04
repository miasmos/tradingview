import { HeadlineOptions, HeadlineResponse, Headline, ScanOptions, ScanResponse } from "../types";
import { Subdomain, Locale, Market } from "../enum";
import client from "./client";
import Sentiment from "../services/sentiment";

class TradingViewApi {
    static async headlines({
        locale = Locale.English,
        ...options
    }: HeadlineOptions): Promise<HeadlineResponse> {
        const headlines = await client.get<HeadlineResponse>({
            subdomain: Subdomain.News,
            path: "/headlines/yahoo/",
            params: {
                locale,
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
            params: options,
            form: config
        });
    }
}

export default TradingViewApi;
