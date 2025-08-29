import { Component, AfterViewInit, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'ng-apexcharts';

type ChartType = 'bar' | 'line' | 'area' | 'pie';

interface DashboardWidget extends GridsterItem {
  id: number;
  type: ChartType;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GridsterModule, NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  readonly defaultWidgets: DashboardWidget[] = [
    { cols: 4, rows: 4, y: 0, x: 0, id: 1, type: 'bar' },
    { cols: 4, rows: 4, y: 0, x: 4, id: 2, type: 'line' }
  ];

  // Signals
  widgets = signal<DashboardWidget[]>([]);
  chartOptions: any = signal<Record<number, ApexOptions>>({});
  nextId = signal(3);
  editable = signal(false);

  // Grid config
  options: GridsterConfig = {
    draggable: {
      enabled: this.editable(),
      ignoreContent: false,
      dragHandleClass: 'drag-handle',
      ignoreContentClass: 'no-drag'
    },
    resizable: {
      enabled: this.editable(),
      handles: {
        s: true, e: true, n: true, w: true,
        se: true, ne: true, sw: true, nw: true
      }
    },
    minCols: 12,
    minRows: 12,
    maxCols: 24,
    maxRows: 100,
    margin: 10,
    outerMargin: true,
    gridType: 'scrollVertical',
    displayGrid: 'onDrag&Resize',
    pushItems: true,
    swap: true,
    setGridSize: true
  };

  constructor() {
    this.loadLayout();
    effect(() => {
      this.options.draggable!.enabled = this.editable();
      this.options.resizable!.enabled = this.editable();
    
      // Inform Gridster to apply changes
      this.options.api?.optionsChanged?.();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.options.api?.optionsChanged?.(); // <--- add this line
      window.dispatchEvent(new Event('resize')); // already present
    }, 300);
  }

  getChartOptions(type: ChartType): ApexOptions {
    const data = [30, 40, 35, 50, 49, 60, 70, 91, 125];
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

    if (type === 'pie') {
      return {
        chart: { type: 'pie', height: '100%' },
        series: data,
        labels,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: { width: 200 },
            legend: { position: 'bottom' }
          }
        }]
      };
    }

    return {
      chart: { type, height: '100%' },
      series: [{ name: 'Sales', data }],
      xaxis: { categories: labels }
    };
  }

  // Add new widget
  addWidget(): void {
    const current = this.widgets();
    const newWidget: DashboardWidget = {
      cols: 4,
      rows: 4,
      y: Math.floor(current.length / 3) * 4,
      x: (current.length % 3) * 4,
      id: this.nextId(),
      type: 'bar'
    };

    this.widgets.set([...current, newWidget]);
    this.chartOptions.update((options: any) => ({ ...options, [newWidget.id]: this.getChartOptions(newWidget.type) }));
    this.nextId.set(this.nextId() + 1);
  }

  removeWidget(id: number): void {
    this.widgets.set(this.widgets().filter(w => w.id !== id));
    this.chartOptions.update((options: any) => {
      const updated = { ...options };
      delete updated[id];
      return updated;
    });
  }

  changeChartType(widget: DashboardWidget, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const type = selectElement.value as ChartType; 
    widget.type = type;
  
    this.chartOptions.update((options: any) => ({
      ...options,
      [widget.id]: this.getChartOptions(type)
    }));
  }

  saveLayout(): void {
    localStorage.setItem('dashboardLayout', JSON.stringify(this.widgets()));
    this.toggleEditable();
  }

  loadLayout(): void {
    const saved = localStorage.getItem('dashboardLayout');
    const widgets = saved ? JSON.parse(saved) as DashboardWidget[] : this.defaultWidgets;

    this.widgets.set(widgets);

    // Rebuild chart options
    const options: Record<number, ApexOptions> = {};
    let maxId = 2;

    widgets.forEach(w => {
      options[w.id] = this.getChartOptions(w.type);
      if (w.id > maxId) maxId = w.id;
    });

    this.chartOptions.set(options);
    this.nextId.set(maxId + 1);
  }

  handleDragStart(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    console.log(target.classList);
    
    if (!target.classList.contains('drag-handle')) {
      event.preventDefault();
      // event.stopPropagation();
    }
  }

  toggleEditable(): void {
    this.editable.update(d => !d);
    this.options.api?.optionsChanged?.();
  }
}
