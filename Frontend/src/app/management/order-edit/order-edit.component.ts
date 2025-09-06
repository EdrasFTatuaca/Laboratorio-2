import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css']
})
export class OrderEditComponent {
  
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private dialogRef = inject(MatDialogRef<OrderEditComponent>);
  
  orderForm: FormGroup;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Order) {
    this.isEditMode = !!data;
    
    this.orderForm = this.fb.group({
      number: [data?.number || 0, [Validators.required, Validators.min(1)]],
      personId: [data?.personId || 0, [Validators.required, Validators.min(1)]],
      createdBy: [data?.createdBy || 1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;
      
      if (this.isEditMode) {
        this.updateOrder(orderData);
      } else {
        this.createOrder(orderData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private createOrder(orderData: any) {
    if (confirm('¿Crear nueva orden? Se creará una nueva orden con los datos ingresados')) {
      // Asegurarse de que los tipos de datos sean correctos
      const orderToCreate: Order = {
        number: Number(orderData.number),
        personId: Number(orderData.personId),
        createdBy: Number(orderData.createdBy)
      };

      console.log('Enviando datos al servidor:', orderToCreate);

      this.orderService.createOrder(orderToCreate).subscribe({
        next: () => {
          alert('¡Éxito! Orden creada correctamente');
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error creando orden:', error);
          console.error('Detalles del error:', error.error);
          alert(`Error al crear la orden: ${error.error?.message || 'Error desconocido'}`);
        }
      });
    }
  }

  private updateOrder(orderData: any) {
    if (confirm('¿Actualizar orden? Se actualizarán los datos de la orden')) {
      const orderId = this.data?.id;
      if (orderId) {
        // Asegurarse de que los tipos de datos sean correctos
        const orderToUpdate: Order = {
          id: orderId,
          number: Number(orderData.number),
          personId: Number(orderData.personId),
          createdBy: Number(orderData.createdBy)
        };

        console.log('Actualizando orden con datos:', orderToUpdate);

        this.orderService.updateOrder(orderId, orderToUpdate).subscribe({
          next: () => {
            alert('¡Éxito! Orden actualizada correctamente');
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error actualizando orden:', error);
            console.error('Detalles del error:', error.error);
            alert(`Error al actualizar la orden: ${error.error?.message || 'Error desconocido'}`);
          }
        });
      }
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.orderForm.controls).forEach(key => {
      this.orderForm.get(key)?.markAsTouched();
    });
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.orderForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName} es requerido`;
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('min')) {
      return `${fieldName} debe ser mayor a 0`;
    }
    return '';
  }
}
