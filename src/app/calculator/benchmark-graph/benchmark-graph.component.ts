import { Component, Input } from '@angular/core';
import { BenchmarkAnalysisResponse } from '../benchmark-analysis-response';
import { IntermediateResult } from '../intermediate-result';
import { ResultOverTime } from '../result-over-time';

@Component({
  selector: 'app-benchmark-graph',
  templateUrl: './benchmark-graph.component.html',
  styleUrls: ['./benchmark-graph.component.sass']
})


export class BenchmarkGraphComponent  {


  @Input()
  set benchmarkAnalysisResponse(bar: BenchmarkAnalysisResponse) {
    this._benchmarkAnalysisResponse = bar;
    this.insertBenchmarkResultsIntoMulti();
  }
  private _benchmarkAnalysisResponse: BenchmarkAnalysisResponse;

  multiLineData: any[];

  // options
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  yAxisLabel = 'Return';
  timeline = true;

  colorScheme = {
    // original values: domain: ['#31708e', '#839b7d', '#4e7045', '#3d5d36', '#25411f', '#aae3f5']
    domain: ['#31708e', '#47683e', '#698561', '#a7b8a2', '#4e7045', '#839b7d']
  };






  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


  private insertBenchmarkResultsIntoMulti() {
    const graphData: any[] = this._benchmarkAnalysisResponse.resultsOverTime.map( (rot: ResultOverTime) => {
        return {
          name: rot.name,
          series: rot.intermediateResults.map((ir: IntermediateResult) => {
                    return {
                      name: ir.date,
                      value: (ir.returnOnDate * 100),  // Service return 0.027 for 2.7% - We want to show 2.7%, so multiply by 100
                    };
                  })
        };
      });
    this.multiLineData = graphData;
  }


}
