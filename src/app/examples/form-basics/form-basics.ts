import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Exemple: Bases de FormControl
 * 
 * Ce composant démontre:
 * - Création et utilisation individuelle de FormControl
 * - Application de validateurs à FormControl
 * - Propriétés d'état de FormControl (valide, non valide, pristine, modifié, consulté)
 * - Méthodes de FormControl (setValue, patchValue, reset, enable, disable)
 * - Flux observables (valueChanges, statusChanges)
 * - Obtenir des erreurs depuis FormControl
 * 
 * Concepts Clés:
 * 1. FormControl est le bloc de construction de base pour tous les formulaires
 * 2. Chaque FormControl suit son propre état
 * 3. FormControl expose des observables pour la programmation réactive
 * 4. Les validateurs peuvent être appliqués aux contrôles individuels
 * 5. L'état peut être géré programmatiquement
 */
@Component({
  selector: 'app-form-basics',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-basics.html',
  styleUrl: './form-basics.css',
})
export class FormBasics implements OnInit, OnDestroy {
  // Individual FormControls
  email: FormControl;
  age: FormControl;
  website: FormControl;
  subscribe: FormControl;

  // Track value changes
  valueChangeLog: string[] = [];
  statusChangeLog: string[] = [];

  // Unsubscribe on component destroy
  private destroy$ = new Subject<void>();

  constructor() {
    // Create FormControls with different validators
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.age = new FormControl(18, [Validators.required, Validators.min(18), Validators.max(120)]);
    this.website = new FormControl('', [Validators.pattern(/^(https?:\/\/)?.+\..+$/)]);
    this.subscribe = new FormControl(false);
  }

  ngOnInit(): void {
    // Subscribe to value changes on email control
    this.email.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.valueChangeLog.push(`Email changed to: ${value}`);
        if (this.valueChangeLog.length > 5) {
          this.valueChangeLog.shift();
        }
      });

    // Subscribe to status changes on age control
    this.age.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.statusChangeLog.push(`Age status changed to: ${status}`);
        if (this.statusChangeLog.length > 5) {
          this.statusChangeLog.shift();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Définir la valeur d'e-mail programmatiquement
   */
  setEmailValue(): void {
    this.email.setValue('user@example.com');
  }

  /**
   * Réinitialiser l'e-mail à l'état initial
   */
  resetEmail(): void {
    this.email.reset();
  }

  /**
   * Marquer l'e-mail comme consulté
   */
  markEmailTouched(): void {
    this.email.markAsTouched();
  }

  /**
   * Marquer l'e-mail comme modifié
   */
  markEmailDirty(): void {
    this.email.markAsDirty();
  }

  /**
   * Désactiver/Activer le contrôle d'e-mail
   */
  toggleEmailDisabled(): void {
    if (this.email.disabled) {
      this.email.enable();
    } else {
      this.email.disable();
    }
  }

  /**
   * Augmenter l'âge
   */
  incrementAge(): void {
    const currentAge = this.age.value || 0;
    this.age.setValue(currentAge + 1);
  }

  /**
   * Réduire l'âge
   */
  decrementAge(): void {
    const currentAge = this.age.value || 0;
    this.age.setValue(currentAge - 1);
  }

  /**
   * Obtenir les erreurs d'âge
   */
  getAgeError(): string {
    if (this.age.hasError('min')) {
      return 'L\"\u00e2ge doit être d\"au moins 18 ans';
    }
    if (this.age.hasError('max')) {
      return 'L\"\u00e2ge ne doit pas dépasser 120 ans';
    }
    if (this.age.hasError('required')) {
      return 'L\"\u00e2ge est requis';
    }
    return '';
  }

  /**
   * Obtenir les erreurs du site Web
   */
  getWebsiteError(): string {
    if (this.website.hasError('pattern')) {
      return 'Veuillez entrer une URL de site web valide';
    }
    return '';
  }

  /**
   * Effacer tous les journaux
   */
  clearLogs(): void {
    this.valueChangeLog = [];
    this.statusChangeLog = [];
  }
}
