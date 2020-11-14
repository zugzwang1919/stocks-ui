import { ResultOverTime } from './result-over-time';

export interface BenchmarkAnalysisResponse {
    calculatorResults: any;
    resultsOverTime: ResultOverTime[];
}
