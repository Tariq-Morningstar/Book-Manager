import { ApiService } from './services/api.service';
import { DialogComponent } from './dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BoookManager';

  displayedColumns: string[] = ['id', 'BookName', 'AuthorName', 'IssueDate', 'Price', 'Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog: MatDialog, private api: ApiService) {

  }
  ngOnInit(): void {
    this.getAllBook();
  }
  openAddBook() {
    this.dialog.open(DialogComponent, {
     width:'30%'
    }).afterClosed().subscribe(val=>{
      this.getAllBook();
    })
  }
  getAllBook(){
  this.api.getBook().subscribe({
    next:(val: any)=>{
      this.dataSource= new MatTableDataSource(val);
      this.dataSource.paginator= this.paginator;
      this.dataSource.sort= this.sort;
    },
    error: (err)=>{
      alert("Error while fetching the records");
    }
      
  })
  }
  editBook(row: any){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data: row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllBook();
      }
    })


   
  }
  deleteBook(id:number){
    this.api.deleteBook(id)
    .subscribe({
      next:(val)=>{
        alert("Book Details Deleted Successfully");
        this.getAllBook();
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

