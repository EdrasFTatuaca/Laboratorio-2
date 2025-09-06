import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import swal from 'sweetalert';

@Component({
  selector: 'app-person-edit',
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
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent {

  private personService = inject(PersonService);
  private dialogRef = inject(MatDialogRef<PersonEditComponent>);
  private fb = inject(FormBuilder);
  personForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: Person) {
    this.personForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    if (this.data) this.personForm.patchValue(this.data);
  }

  onSubmit() {
    if (this.personForm.valid) {
      const val = this.personForm.value as Person;
      const action = this.data?.id ? 'actualizar' : 'crear';
      const message = this.data?.id 
        ? '¿Estás seguro de que deseas actualizar esta persona?' 
        : '¿Estás seguro de que deseas crear esta nueva persona?';
      
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
              this.personService.update(this.data.id, val).subscribe({
                next: () => {
                  swal("¡Éxito!", "Persona actualizada correctamente", "success");
                  this.dialogRef.close(true);
                },
                error: (error) => {
                  swal("Error", "No se pudo actualizar la persona", "error");
                  console.error('Error updating person:', error);
                }
              });
            } else {
              this.personService.add(val).subscribe({
                next: () => {
                  swal("¡Éxito!", "Persona creada correctamente", "success");
                  this.dialogRef.close(true);
                },
                error: (error) => {
                  swal("Error", "No se pudo crear la persona", "error");
                  console.error('Error creating person:', error);
                }
              });
            }
          }
        });
    }
  }
}
