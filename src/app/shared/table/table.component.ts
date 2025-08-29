import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DateFilterComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
  // Inputs
  @Input() total: number = 0;
  @Input() totalText: string = '';
  @Input() loading: boolean = false;
  @Input() size: number = 10;
  @Input() currentPage: number = 1;
  @Input() data: any[] = [];
  @Input() rowTemplate!: TemplateRef<any>;
  @Input() customRowTemplate!: TemplateRef<any>;

  @Input() columns: { field: string; label: string; sortable?: boolean }[] = [];
  @Input() isSearch: boolean = true;
  @Input() isPagination: boolean = true;
  @Input() isDateFilter: boolean = false;
  @Input() isStatus: boolean = false;
  @Input() isSearchOption: boolean = false;

  // Outputs
  @Output() search = new EventEmitter<string>();
  @Output() searchFilter = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortDataChange = new EventEmitter<any>();

  // Internal state
  displayedData: any[] = [];

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  selectedDateRange = { startDate: '', endDate: '' };
  selectedStatus: string = '';
  searchTerm: string = '';

  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  maxPageLimit: number = 10;
  showEllipsis: boolean = false;

  private destroy$ = new Subject<void>();
  private searchTermSubject = new Subject<void>();

  ngOnInit() {
    this.updatePages();
    this.updateDisplayedData();

    this.searchTermSubject
    .pipe(debounceTime(400), takeUntil(this.destroy$))
    .subscribe(() => {
      this.search.emit(this.searchTerm);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['currentPage'] || changes['size']) {
      // Set total from data length for frontend pagination
      if (this.pageChange.observers.length === 0 && Array.isArray(this.data)) {
        this.total = this.data.length;
      }
    
      this.updatePages();
      this.updateDisplayedData();
    }
  }

  updatePages() {
    this.totalPages = Math.ceil(this.total / this.size);
    const currentBlock = Math.floor((this.currentPage - 1) / this.maxPageLimit);
    const startPage = currentBlock * this.maxPageLimit + 1;
    const endPage = Math.min(
      startPage + this.maxPageLimit - 1,
      this.totalPages
    );

    this.visiblePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
    this.showEllipsis = endPage < this.totalPages;
  }

  updateDisplayedData() {
    const start = (this.currentPage - 1) * this.size;
    const end = this.currentPage * this.size;

    // If parent handles pagination, use data as-is
    if (this.pageChange.observers.length > 0) {
      this.displayedData = this.data;
    } else {
      this.displayedData = this.data.slice(start, end);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitOrUpdatePage();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.emitOrUpdatePage();
    }
  }

  goToPage(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.emitOrUpdatePage();
    }
  }

  private emitOrUpdatePage() {
    this.updatePages();
    if (this.pageChange.observers.length > 0) {
      this.pageChange.emit(this.currentPage);
    } else {
      this.updateDisplayedData();
    }
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const sorted = this.sort(
      this.displayedData.slice(),
      column,
      this.sortDirection
    );
    this.sortDataChange.emit(sorted);
  }

  private sort(arr: any[], column: string, direction: 'asc' | 'desc') {
    return arr.sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSearch() {
    this.searchTermSubject.next();
  }

  onDateRangeSelected(range: any) {
    this.selectedDateRange = range;
  }

}
