declare module "sentiment" {
    interface AnalyzeOptions {
        language?: string;
        extras?: { [key: string]: string };
    }

    export interface AnalyzeResult {
        score: number;
        comparative: number;
        calculation: { [key: string]: number }[];
        words: string[];
        positive: string[];
        negative: string[];
    }

    class Sentiment {
        analyze(
            phrase: string,
            options: AnalyzeOptions,
            callback?: () => AnalyzeResult
        ): AnalyzeResult;

        registerLanguage(languageCode: string, language: string): void;
    }

    export default Sentiment;
}
