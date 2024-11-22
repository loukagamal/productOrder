import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/core/models/product.model';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.scss'],
})
export class OrderCreateComponent implements OnInit {
  selectedProducts: any = [];
  customer = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };
  paymentMethod = 'Cash'; // Default payment method

  constructor( private dataService:DataService,private router: Router) {}

  ngOnInit(): void {
    // Retrieve the selected products from state
    this.selectedProducts=this.dataService.selectedProducts
   
  }

  // Handle order submission
  submitOrder(): void {
    if (this.isFormValid() &&this.selectedProducts.length>0) {
      const newOrder = {
        customer: this.customer,
        products: this.selectedProducts,
        paymentMethod: this.paymentMethod,
        orderDate: new Date().toISOString(),
      };

      console.log('New Order:', newOrder);
      // Here you can call a service to save the order or send it to a backend
    } else {
      alert('Please complete all fields.');
    }
  }

  // Validate the order form
  isFormValid(): any {
    return (
      this.customer.name &&
      this.customer.email &&
      this.customer.phone &&
      this.customer.address
    );
  }
}
