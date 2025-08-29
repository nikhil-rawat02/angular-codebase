import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import dayjs, { Dayjs } from 'dayjs';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { LocaleService } from 'ngx-daterangepicker-material';
import utc from 'dayjs/plugin/utc';
import moment from 'moment';
dayjs.extend(utc);

@Component({
  selector: 'app-date-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxDaterangepickerMd],
  templateUrl: './date-filter.component.html',
  styleUrl: './date-filter.component.scss',
})
export class DateFilterComponent {
  selected: any;
  alwaysShowCalendars: boolean;
  @Output() dateRangeSelected = new EventEmitter<any>();

  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment().subtract(1, 'month').startOf('month'),
      moment().subtract(1, 'month').endOf('month'),
    ],
  };

  invalidDates: moment.Moment[] = [
    moment().add(2, 'days'),
    moment().add(3, 'days'),
    moment().add(5, 'days'),
  ];

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some((d) => d.isSame(m, 'day'));
  };

  constructor(private eRef: ElementRef) {
    this.alwaysShowCalendars = true;
  }

  isPickerOpen = false;
  togglePicker(isOpen: boolean) {
    this.isPickerOpen = isOpen;
  }

  onApply(){
    this.isPickerOpen = false;
    this.dateRangeSelected.emit(this.selected);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isPickerOpen = false;
    }
  }
}
