import { Subscription } from 'rxjs';
import { User } from '../_models';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services';

import * as fileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as pa from 'path';

let USER_DATA: any = [];

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
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Component({ 
  templateUrl: 'tasks.component.html',
  styleUrls: ['./tasks.component.css'] 
})
export class TasksComponent {
    currentUser: User | undefined;
    currentUserSubscription: Subscription;
    
    ngOnInit() {}

    constructor(
      private router: Router,
      private authenticationService: AuthenticationService,
      public dialog: MatDialog
    ) { 
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = new User();
            this.currentUser.fullName = "Test"
        });
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

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

  removeRow(id: number) {
    this.dataSource = this.dataSource.filter((u: any) => u.id !== id);
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

  selectAll(event: any) {
    this.dataSource = this.dataSource.map((item: any) => ({
      ...item,
      isSelected: event.checked,
    }));
  }

  export(){
    console.log("exporting datasource");
    console.log(this.dataSource);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'C:/Workspace/Docs/ExcelSheet.xlsx');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    fileSaver.saveAs(data, fileName);
 }

  onFileChange(evt: any) {
    let rows: any[][];
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* get data from excel */
      rows = XLSX.utils.sheet_to_json(ws);
      rows.forEach(element => {
        this.dataSource = [element, ...this.dataSource];
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }
}