import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ChartComponent as ApexChartComponent, } from 'ng-apexcharts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [ApexChartComponent, CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnChanges{
  @Input() type!: 'line' | 'bar' | 'donut' | 'area';
  @Input() title!: string;
  @Input() data!: ApexAxisChartSeries | any; 

  chartOptions: Partial<ApexChart> | any;

  ngOnInit() {    
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChartOptions();
    }
  }

  updateChartOptions() {      
    this.chartOptions = {
      series: this.data?.series?.length ? this.data.series : [0], 
      chart: {
        type: this.type,
        height: 300
      },
      title: {
        text: this.title,
        align: 'center',
        style: { fontSize: '16px' }
      },
      labels: this.data?.labels?.length ? this.data.labels : ['No Data'],
      colors: this.data?.colors && this.data.colors.length ? this.data.colors : ['#008FFB'],
      stroke: { curve: 'smooth' },
      dataLabels: { enabled: false },
      legend: { position: 'bottom' },
      plotOptions: {
        bar: { horizontal: false }
      },
      xaxis: this.data?.xaxis ? this.data.xaxis : { categories: [] }
    };
  }

}
