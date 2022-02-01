import { AfterViewInit, Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSelect } from '@angular/material/select/select';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  styleUrls: ['./searchable-dropdown.component.scss']
})
export class SearchableDropdownComponent<T> implements OnInit, OnDestroy {

  @Input()
  dropdownCtrl = new FormControl();
  @Input()
  dropdownFormGroup!: FormGroup;
  @Input()
  dropdownValue!: T | any;
  @Input()
  dropdownValueOption: T | any = [];
  @Input()
  label!: string;
  @Input()
  placeholder!: string;
  @Input()
  passClassName = '';
  @Input()
  required = false;
  @Input()
  requiredSign = '';
  @Input()
  disableForm: boolean = false;
  @Input('optionName') 
  optionName!: (data: T | any) => string


  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  onSelect = new EventEmitter<T | any>();

  onDestroy = new Subject<void>();


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // if (!this.placeholder) { this.translate.instant('placeholder-select-option'); }
    // if (!this.label) { this.translate.instant('vms-label-select'); }

    if (this.dropdownValue) {
      this.dropdownCtrl.setValue(this.dropdownValue);
    }
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  getSelectedValue() {
    return this.dropdownCtrl.value;
  }

}
