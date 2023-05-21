import { Subscription } from 'rxjs';
import { User } from '../_models';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services';


import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


const USER_DATA = [];

const COLUMNS_SCHEMA = [
  {
    key: 'isSelected',
    type: 'isSelected',
    label: '',
  },
  {
    key: 'task',
    type: 'text',
    label: 'To Do',
  },
  {
    key: 'due',
    type: 'date',
    label: 'Due Date',
  },
  {
    key: 'remarks',
    type: 'text',
    label: 'Remarks',
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];



@Component({ 
  templateUrl: 'tasks.component.html',
  styleUrls: ['./tasks.component.css'] 
})
export class TasksComponent {
    currentUser: User;
    currentUserSubscription: Subscription;
    ngOnInit() {}
    constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      public dialog: MatDialog
    ) { 
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    
    // private fieldArray: Array<any> = [];
    // private newAttribute: any = {};

    // addFieldValue() {
    //     this.fieldArray.push(this.newAttribute)
    //     this.newAttribute = {};
    // }

    // deleteFieldValue(index) {
    //     this.fieldArray.splice(index, 1);
    // }

  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  dataSource = USER_DATA;
  columnsSchema: any = COLUMNS_SCHEMA;


  addRow() {
    const newRow = {
      id: Date.now(),
      name: '',
      occupation: '',
      dateOfBirth: '',
      age: 0,
      isEdit: true,
    };
    this.dataSource = [newRow, ...this.dataSource];
  }

  removeRow(id) {
    this.dataSource = this.dataSource.filter((u) => u.id !== id);
  }

  removeSelectedRows() {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.dataSource = this.dataSource.filter((u: any) => !u.isSelected);
        }
      });
  }

  isAllSelected() {
    return this.dataSource.every((item: any) => item.isSelected);
  }

  isAnySelected() {
    return this.dataSource.some((item: any) => item.isSelected);
  }

  selectAll(event) {
    this.dataSource = this.dataSource.map((item: any) => ({
      ...item,
      isSelected: event.checked,
    }));
  }
}