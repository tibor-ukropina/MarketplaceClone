import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-checkout-modal',
  imports: [FormsModule],
  templateUrl: './checkout-modal.html',
  styleUrl: './checkout-modal.scss',
})
export class CheckoutModal {
  buyerName = '';
  buyerEmail = '';
  orderPlaced = signal(false);
  confirmedTotal = signal(0);

  constructor(public cart: CartService) {}

  onConfirm() {
    this.confirmedTotal.set(this.cart.total());
    this.orderPlaced.set(true);
    this.cart.clearCart();
  }

  onClose() {
    this.cart.checkoutOpen.set(false);
    this.orderPlaced.set(false);
    this.buyerName = '';
    this.buyerEmail = '';
  }
}
