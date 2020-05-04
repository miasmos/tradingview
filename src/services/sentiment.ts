import SentimentLib, { AnalyzeResult } from "sentiment";
import md5 from "md5";

class Sentiment {
    static client = new SentimentLib();

    static get(phrase: string): AnalyzeResult {
        return Sentiment.client.analyze(phrase, {
            language: "en"
        });
    }
}

export default Sentiment;
