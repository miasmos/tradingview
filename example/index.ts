import TradingViewApi, { HeadlineCategory } from "../src";

const filter = require("./buyGaps.json");

(async (): Promise<void> => {
    try {
        console.log(
            await TradingViewApi.headlines({
                category: HeadlineCategory.Stock,
                proSymbol: "AAPL"
            })
        );

        // console.log(
        //     JSON.stringify(
        //         await TradingViewApi.scan({
        //             config: filter
        //         }),
        //         undefined,
        //         2
        //     )
        // );
    } catch (error) {
        console.log("got error:", error);
    }
})();
