import { CommonModule } from '@angular/common';
import type {
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-selectable-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selectable-table.component.html',
  styleUrls: ['./selectable-table.component.scss'],
})
export class SelectableTableComponent implements OnInit, OnChanges, OnDestroy {
  // Inputs
  @Input() total = 0;
  @Input() totalText = '';
  @Input() loading = false;
  @Input() size = 10;
  @Input() currentPage = 1;
  @Input() data: any[] = [];
  @Input() rowTemplate!: TemplateRef<any>;
  @Input() columns: { field: string; label: string; sortable?: boolean }[] = [];
  @Input() isSearch = true;
  @Input() isPagination = true;
  @Input() isDateFilter = false;
  @Input() defaultSelected: any[] = [];

  // Outputs
  @Output() search = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortDataChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

  // Internal state
  displayedData: any[] = [];
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm = '';
  pages: number[] = [];
  totalPages = 0;
  visiblePages: number[] = [];
  maxPageLimit = 10;
  showEllipsis = false;

  // Selection
  selectedRows: any[] = [];
  allSelected = false;

  private readonly destroy$ = new Subject<void>();
  private readonly searchTermSubject = new Subject<void>();

  ngOnInit(): void {
    this.updatePages();
    this.updateDisplayedData();

    this.searchTermSubject
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(() => {
        this.search.emit(this.searchTerm);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['currentPage'] || changes['size']) {
      if (this.pageChange.observers.length === 0 && Array.isArray(this.data)) {
        this.total = this.data.length;
      }
      this.updatePages();
      this.updateDisplayedData();

      // Preselect rows
      if (this.defaultSelected?.length) {
        this.selectedRows = this.displayedData.filter((row) =>
          this.defaultSelected.includes(row)
        );
        this.allSelected =
          this.selectedRows.length === this.displayedData.length;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updatePages(): void {
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

  updateDisplayedData(): void {
    const start = (this.currentPage - 1) * this.size;
    const end = this.currentPage * this.size;
    if (this.pageChange.observers.length > 0) {
      this.displayedData = this.data;
    } else {
      this.displayedData = this.data.slice(start, end);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitOrUpdatePage();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.emitOrUpdatePage();
    }
  }

  goToPage(page: number): void {
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.emitOrUpdatePage();
    }
  }

  private emitOrUpdatePage(): void {
    this.updatePages();
    if (this.pageChange.observers.length > 0) {
      this.pageChange.emit(this.currentPage);
    } else {
      this.updateDisplayedData();
    }
  }

  sortData(column: string): void {
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

  onSearch(): void {
    this.searchTermSubject.next();
  }

  // Selection Logic
  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.allSelected = checked;
    if (checked) {
      this.selectedRows = [...this.displayedData];
    } else {
      this.selectedRows = [];
    }
    this.selectionChange.emit(this.selectedRows);
  }

  toggleSelection(event: Event, row: any): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter((r) => r !== row);
    }
    this.allSelected = this.selectedRows.length === this.displayedData.length;
    this.selectionChange.emit(this.selectedRows);
  }

  isSelected(row: any) {
    return this.selectedRows.includes(row);
  }
}
