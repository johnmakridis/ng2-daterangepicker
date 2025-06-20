import {
  Directive,
  AfterViewInit,
  OnDestroy,
  DoCheck,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  KeyValueDiffers
} from '@angular/core';
import 'daterangepicker';
import $ from 'jquery';
import { DaterangepickerConfig } from './ngx-daterangepicker.service';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[daterangepicker]',
    standalone: false
})
// tslint:disable-next-line:directive-class-suffix
export class DaterangepickerComponent implements AfterViewInit, OnDestroy, DoCheck {

  private activeRange: any;
  private targetOptions: any = {};
  // tslint:disable-next-line:variable-name
  private _differ: any = {};

  public datePicker: any;

  @Input() options: any = {};

  @Output() selected = new EventEmitter();
  @Output() cancelDaterangepicker = new EventEmitter();
  @Output() applyDaterangepicker = new EventEmitter();
  @Output() hideCalendarDaterangepicker = new EventEmitter();
  @Output() showCalendarDaterangepicker = new EventEmitter();
  @Output() hideDaterangepicker = new EventEmitter();
  @Output() showDaterangepicker = new EventEmitter();

  constructor(
    private input: ElementRef,
    private config: DaterangepickerConfig,
    private differs: KeyValueDiffers
  ) {
    this._differ.options = this.differs.find(this.options).create();
    this._differ.settings = this.differs.find(this.config.settings).create();
  }

  ngAfterViewInit() {
    this.render();
    this.attachEvents();
  }

  ngDoCheck() {
    const optionsChanged = this._differ.options.diff(this.options);
    const settingsChanged = this._differ.settings.diff(this.config.settings);

    if (optionsChanged || settingsChanged) {
      this.render();
      this.attachEvents();
      if (this.activeRange && this.datePicker) {
        this.datePicker.setStartDate(this.activeRange.start);
        this.datePicker.setEndDate(this.activeRange.end);
      }
    }
  }

  ngOnDestroy() {
    this.destroyPicker();
  }

  private render(): void {
    this.targetOptions = Object.assign({}, this.config.settings, this.options);

    ($(this.input.nativeElement) as any).daterangepicker(
      this.targetOptions,
      this.callback.bind(this)
    );

    if (this.options.customClasses && this.options.customClasses.length) {
      for (const customClass of this.options.customClasses) {
        this.datePicker = (
          $(this.input.nativeElement) as any
        ).data('daterangepicker').container.addClass(customClass);
      }
    } else {
      this.datePicker = (
        $(this.input.nativeElement) as any
      ).data('daterangepicker');
    }
  }

  private callback(start?: any, end?: any, label?: any): void {
    this.activeRange = {
      start: start,
      end: end,
      label: label
    };

    this.selected.emit(this.activeRange);
  }

  private destroyPicker(): void {
    try {
      $(this.input.nativeElement).data('daterangepicker').remove();
    } catch (e) {
      console.log(e.message);
    }
  }

  private attachEvents(): void {
    $(this.input.nativeElement).on('cancel.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.cancelDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('apply.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.applyDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('hideCalendar.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.hideCalendarDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('showCalendar.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.showCalendarDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('hide.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.hideDaterangepicker.emit(event);
      }
    );

    $(this.input.nativeElement).on('show.daterangepicker',
      (e: any, picker: any) => {
        const event = { event: e, picker: picker };
        this.showDaterangepicker.emit(event);
      }
    );
  }

}
