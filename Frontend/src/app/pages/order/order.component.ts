import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { OrderEditComponent } from '../../management/order-edit/order-edit.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-order',
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
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  private orderService = inject(OrderService);
  private dialog = inject(MatDialog);

  displayedColumns = ['id', 'number', 'personId', 'createdBy', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<Order>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        console.log('Response from API:', response);
        
        let data: Order[] = [];
        
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
      error: (error: any) => {
        console.error('Error loading orders:', error);
        this.dataSource.data = [];
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(order?: Order): void {
    const dialogRef = this.dialog.open(OrderEditComponent, {
      width: '99%',
      height: '99%',
      data: order,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) this.loadOrders();
    });
  }

  delete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      this.orderService.deleteOrder(id).subscribe(() => this.loadOrders());
    }
  }
}
