import { CommonModule } from '@angular/common';
import { Component, inject, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person';
import { PersonEditComponent } from '../../management/person-edit/person-edit.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [
     CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent {

  private PersonService = inject(PersonService);
  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'firstName', 'lastName', 'email', 'action'];
  dataSource = new MatTableDataSource<Person>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadPersons();
  }

  loadPersons() {
    this.PersonService.getAll().subscribe({
      next: (response: any) => {
        console.log('Response from API:', response); // Para debug
        
        // Asegurar que tenemos un array
        let data: Person[] = [];
        
        if (Array.isArray(response)) {
          data = response;
        } else if (response && response.$values && Array.isArray(response.$values)) {
          // Si viene con wrapper de ReferenceHandler.Preserve
          data = response.$values;
        } else if (response && typeof response === 'object') {
          // Si es un objeto, intentar extraer el array
          const keys = Object.keys(response);
          const arrayKey = keys.find(key => Array.isArray(response[key]));
          if (arrayKey) {
            data = response[arrayKey];
          }
        }
        
        console.log('Processed data:', data); // Para debug
        this.dataSource.data = data;
        
        // Configurar paginator y sort después de que los datos estén listos
        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        });
      },
      error: (error) => {
        console.error('Error loading persons:', error);
        this.dataSource.data = [];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(Person?: Person) {
    const dialogRef = this.dialog.open(PersonEditComponent, {
      width: '99%',
      height: '99%',
      data: Person,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadPersons();
    });
  }

  delete(id: number) {
    if (confirm('Are you sure?')) {
      this.PersonService.delete(id).subscribe(() => this.loadPersons());
    }
  }

}
