import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SearchableDropdownComponent } from './utils/searchable-dropdown/searchable-dropdown.component';
import { MaterialModule } from './material/material.module';
@NgModule({
  declarations: [
    SearchableDropdownComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    RouterModule,

    SearchableDropdownComponent
  ]
})
export class SharedModule { }
