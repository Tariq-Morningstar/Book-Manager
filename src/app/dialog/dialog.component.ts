import { ApiService } from './../services/api.service';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  bookForm!: FormGroup;
  actionbtn: string='Save'
  constructor ( private formBuilder: FormBuilder, private api : ApiService, private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)public editData: any){}

  ngOnInit():void{
    this.bookForm= this.formBuilder.group({
      BookName:['', Validators.required],
      AuthorName:['', Validators.required],
      IssueDate:['', Validators.required],
      Price:['', Validators.required],


    });

   if(this.editData){
    this.actionbtn="Update";
    this.bookForm.controls['BookName'].setValue(this.editData.BookName);
    this.bookForm.controls['AuthorName'].setValue(this.editData.AuthorName);
    this.bookForm.controls['IssueDate'].setValue(this.editData.IssueDate);
    this.bookForm.controls['Price'].setValue(this.editData.Price);
   }
  }
  saveBook(){
    if(!this.editData){
      if(this.bookForm.valid){
        this.api.postBook(this.bookForm.value)
        .subscribe({
          next:(val: any)=>{
            alert("Book Added succesfully");
            this.bookForm.reset();
            this.dialogRef.close('Saved');
          },
  
          error:()=>{
            alert("Error while adding the product")
          }
        })
      }
    }
    else{
      this.updateBook()
    }
  }
  updateBook(){
    this.api.putBook(this.bookForm.value,this.editData.id)
    .subscribe({
      next:(val: any)=>{
        alert("Book Manager Updated succesfully");
        this.bookForm.reset();
        this.dialogRef.close('Updated');
      },
      error:()=>{
        alert("Error while updating the details")
      }
  })


  }
}
