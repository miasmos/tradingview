import TradingViewApi, { HeadlineCategory } from "../dist";

const filter = require("./buyGaps.json");

(async (): Promise<void> => {
    try {
        console.log(
            JSON.stringify(
                await TradingViewApi.scan({
                    config: filter
                }),
                undefined,
                2
            )
        );

        await TradingViewApi.login({
            username: "username",
            password: "password"
        });

        console.log(await TradingViewApi.logout());
    } catch (error) {
        console.log("got error:", error);
    }
})();
