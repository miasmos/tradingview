import { HeadlineOptions, HeadlineResponse, Headline, ScanOptions, ScanResponse } from "../types";
import { Subdomain, Locale, Market, HeadlineCategory } from "../enum";
import client from "./client";
import Sentiment from "../services/sentiment";

class TradingViewApi {
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
            params: options,
            form: config
        });
    }
}

export default TradingViewApi;
