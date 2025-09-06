import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item';
import { ItemEditComponent } from '../../management/item-edit/item-edit.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item',
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
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {

  private itemService = inject(ItemService);
  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'name', 'price', 'createdBy', 'action'];
  dataSource = new MatTableDataSource<Item>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.itemService.getAll().subscribe({
      next: (response: any) => {
        console.log('Response from API:', response);
        
        let data: Item[] = [];
        
        if (Array.isArray(response)) {
          data = response;
        } else if (response && response.$values && Array.isArray(response.$values)) {
          data = response.$values;
        } else if (response && typeof response === 'object') {
          const keys = Object.keys(response);
          const arrayKey = keys.find(key => Array.isArray(response[key]));
          if (arrayKey) {
            data = response[arrayKey];
          }
        }
        
        console.log('Processed data:', data);
        this.dataSource.data = data;
        
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
        console.error('Error loading items:', error);
        this.dataSource.data = [];
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(item?: Item) {
    const dialogRef = this.dialog.open(ItemEditComponent, {
      width: '99%',
      height: '99%',
      data: item,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadItems();
    });
  }

  delete(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo?')) {
      this.itemService.delete(id).subscribe(() => this.loadItems());
    }
  }
}
