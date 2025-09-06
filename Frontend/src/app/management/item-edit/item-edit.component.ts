import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import swal from 'sweetalert';

@Component({
  selector: 'app-item-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent {

  private itemService = inject(ItemService);
  private dialogRef = inject(MatDialogRef<ItemEditComponent>);
  private fb = inject(FormBuilder);
  itemForm: FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: Item) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      createdBy: [1, Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) this.itemForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const val = this.itemForm.value as Item;
      const action = this.data?.id ? 'actualizar' : 'crear';
      const message = this.data?.id 
        ? '¿Estás seguro de que deseas actualizar este artículo?' 
        : '¿Estás seguro de que deseas crear este nuevo artículo?';
      
      swal({
        title: "¿Confirmar acción?",
        text: message,
        icon: "info",
        buttons: ["Cancelar", "Confirmar"],
        dangerMode: false,
      })
        .then((willProceed) => {
          if (willProceed) {
            if (this.data?.id) {
              this.itemService.update(this.data.id, val).subscribe({
                next: () => {
                  swal("¡Éxito!", "Artículo actualizado correctamente", "success");
                  this.dialogRef.close(true);
                },
                error: (error) => {
                  swal("Error", "No se pudo actualizar el artículo", "error");
                  console.error('Error updating item:', error);
                }
              });
            } else {
              this.itemService.add(val).subscribe({
                next: () => {
                  swal("¡Éxito!", "Artículo creado correctamente", "success");
                  this.dialogRef.close(true);
                },
                error: (error) => {
                  swal("Error", "No se pudo crear el artículo", "error");
                  console.error('Error creating item:', error);
                }
              });
            }
          }
        });
    }
  }
}
