import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Exemple: Formulaire Paiement Multi-Étapes
 * 
 * Ce composant démontre:
 * - Formulaires multi-étapes (Partie 5)
 * - Validation progressive (étape par étape)
 * - Gestion d'état complexe
 * - Résumé et confirmation
 * - Calcul du total et taxes
 */

@Component({
  selector: 'app-checkout-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout-form.html',
  styleUrl: './checkout-form.css',
})
export class CheckoutFormComponent implements OnInit {
  currentStep = 1;
  totalSteps = 4;

  cartForm!: FormGroup;
  shippingForm!: FormGroup;
  paymentForm!: FormGroup;
  confirmationForm!: FormGroup;

  // Simulated shopping cart
  cartItems = [
    { id: 1, name: 'Cours Angular Avancé', price: 99.99, quantity: 1 },
    { id: 2, name: 'Guide Formulaires', price: 39.99, quantity: 1 },
  ];

  shippingMethods = [
    { id: 'standard', name: 'Standard (5-7 jours)', price: 5.99 },
    { id: 'express', name: 'Express (2-3 jours)', price: 14.99 },
    { id: 'overnight', name: 'Nuit (livraison le lendemain)', price: 29.99 },
  ];

  paymentMethods = [
    { id: 'card', name: 'Carte de Crédit' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'bank', name: 'Virement Bancaire' },
  ];

  // Tax rate
  taxRate = 0.2; // 20%

  // Order data
  orderData: any = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  /**
   * Initialiser tous les formulaires
   */
  initializeForms(): void {
    // Étape 1: Panier
    this.cartForm = this.fb.group({
      items: [this.cartItems],
      shippingMethod: ['standard', Validators.required],
    });

    // Étape 2: Expédition
    this.shippingForm = this.fb.group({
      firstName: ['Jean', [Validators.required, Validators.minLength(2)]],
      lastName: ['Dupont', [Validators.required, Validators.minLength(2)]],
      email: ['jean.dupont@example.com', [Validators.required, Validators.email]],
      phone: ['+33 6 12 34 56 78', [Validators.required, Validators.pattern(/^\+?[0-9\s\-()]+$/)]],
      address: ['123 Rue de Paris', [Validators.required, Validators.minLength(5)]],
      city: ['Paris', [Validators.required, Validators.minLength(2)]],
      postalCode: ['75001', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country: ['FR', Validators.required],
    });

    // Étape 3: Paiement
    this.paymentForm = this.fb.group({
      paymentMethod: ['card', Validators.required],
      cardName: ['Jean Dupont', [Validators.required, Validators.minLength(5)]],
      cardNumber: ['4111111111111111', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiryDate: ['12/25', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]],
      cvv: ['123', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]],
      billingAddress: [true],
    });

    // Étape 4: Confirmation
    this.confirmationForm = this.fb.group({
      acceptTerms: [false, Validators.requiredTrue],
      acceptPrivacy: [false, Validators.requiredTrue],
    });
  }

  /**
   * Passer à l'étape suivante
   */
  nextStep(): void {
    const currentForm = this.getCurrentForm();

    if (currentForm && currentForm.valid) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      this.markFormTouched(currentForm);
    }
  }

  /**
   * Revenir à l'étape précédente
   */
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  /**
   * Placer la commande
   */
  placeOrder(): void {
    if (this.confirmationForm.valid) {
      this.orderData = {
        cart: this.cartForm.value,
        shipping: this.shippingForm.value,
        payment: {
          method: this.paymentForm.get('paymentMethod')?.value,
          cardName: this.paymentForm.get('cardName')?.value,
        },
        totals: this.getTotals(),
        orderNumber: 'ORD-' + Date.now(),
        date: new Date().toLocaleDateString('fr-FR'),
      };

      console.log('Commande passée:', this.orderData);
    }
  }

  /**
   * Obtenir le formulaire courant
   */
  getCurrentForm(): FormGroup | null {
    switch (this.currentStep) {
      case 1:
        return this.cartForm;
      case 2:
        return this.shippingForm;
      case 3:
        return this.paymentForm;
      case 4:
        return this.confirmationForm;
      default:
        return null;
    }
  }

  /**
   * Marquer tous les champs comme "touched"
   */
  markFormTouched(form: FormGroup | null): void {
    if (!form) return;

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Obtenir le message d'erreur
   */
  getErrorMessage(fieldName: string): string {
    const form = this.getCurrentForm();
    const control = form?.get(fieldName);

    if (!control || !control.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Ce champ est requis';
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }

    if (control.hasError('email')) {
      return 'Email invalide';
    }

    if (control.hasError('pattern')) {
      return 'Format invalide';
    }

    if (control.hasError('requiredTrue')) {
      return 'Vous devez accepter cette condition';
    }

    return 'Erreur de validation';
  }

  /**
   * Calculer les totaux
   */
  getTotals(): any {
    const subtotal = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = this.shippingMethods.find((m) => m.id === this.cartForm.get('shippingMethod')?.value)?.price || 0;
    const subtotalWithShipping = subtotal + shipping;
    const tax = subtotalWithShipping * this.taxRate;
    const total = subtotalWithShipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  }

  /**
   * Obtenir le label de l'étape
   */
  getStepLabel(step: number): string {
    const labels = ['Panier', 'Expédition', 'Paiement', 'Confirmation'];
    return labels[step - 1] || '';
  }

  /**
   * Vérifier si l'étape est complétée
   */
  isStepCompleted(step: number): boolean {
    const form = this.getFormAtStep(step);
    return form ? form.valid : false;
  }

  /**
   * Obtenir le formulaire d'une étape spécifique
   */
  getFormAtStep(step: number): FormGroup | null {
    switch (step) {
      case 1:
        return this.cartForm;
      case 2:
        return this.shippingForm;
      case 3:
        return this.paymentForm;
      case 4:
        return this.confirmationForm;
      default:
        return null;
    }
  }
}
