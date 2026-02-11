import { Component, OnInit, signal, computed, effect, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * Exemple: Introduction aux Formulaires Réactifs avec Angular Signals
 * 
 * Ce composant démontre:
 * - Service FormBuilder pour créer des formulaires
 * - FormGroup pour grouper plusieurs contrôles de formulaire
 * - Validateurs intégrés (required, email, minLength, pattern)
 * - Groupes imbriqués (personalInfo, contactInfo, passwords)
 * - FormArray pour les champs dynamiques (emails supplémentaires)
 * - Suivi de l'état du formulaire (valid, invalid, dirty, touched)
 * - Gestion de la soumission du formulaire
 * - Validateur personnalisé (correspondance des mots de passe)
 * - **Angular Signals** pour la gestion d'état réactive
 * 
 * Concepts Clés:
 * 1. Le formulaire est défini en TypeScript (approche model-driven)
 * 2. Utilise FormBuilder pour une syntaxe pratique
 * 3. Les validateurs sont définis avec les contrôles
 * 4. Facile à tester et manipuler programmatiquement
 * 5. Supporte les groupes imbriqués et les FormArray
 * 
 * Angular Signals (Nouveauté Angular 17+):
 * - signal() : Crée un signal avec une valeur modifiable
 * - computed() : Crée un signal dérivé qui se recalcule automatiquement
 * - effect() : Exécute une fonction quand les signals dépendants changent
 * - toSignal() : Convertit un Observable en Signal
 */
@Component({
  selector: 'app-reactive-form-intro',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reactive-form-intro.html',
  styleUrl: './reactive-form-intro.css',
})
export class ReactiveFormIntro implements OnInit {
  // ===== FORMULAIRE =====
  // Objet formulaire - FormGroup fortement typé
  registrationForm!: FormGroup;

  // ===== SIGNALS D'ÉTAT (WritableSignal) =====
  // Ces signals remplacent les propriétés classiques pour une réactivité fine
  
  /** Signal pour suivre si le formulaire a été soumis */
  submitted: WritableSignal<boolean> = signal(false);
  
  /** Signal pour stocker les données soumises */
  submittedData: WritableSignal<any> = signal(null);
  
  /** Signal pour les erreurs de soumission */
  submitError: WritableSignal<string | null> = signal(null);
  
  /** Signal pour la visibilité du mot de passe */
  showPassword: WritableSignal<boolean> = signal(false);

  // ===== SIGNALS COMPUTED (Signal - lecture seule) =====
  // Ces signals sont dérivés automatiquement du formulaire
  
  /** Signal calculé: le formulaire est-il valide? */
  formValid!: Signal<boolean>;
  
  /** Signal calculé: le formulaire a-t-il été modifié? */
  formDirty!: Signal<boolean>;
  
  /** Signal calculé: le formulaire a-t-il été touché? */
  formTouched!: Signal<boolean>;
  
  /** Signal calculé: statut du formulaire (VALID, INVALID, PENDING) */
  formStatus!: Signal<string>;
  
  /** Signal calculé: valeur actuelle du formulaire (via toSignal) */
  formValue!: Signal<any>;
  
  /** Signal calculé: nombre d'emails supplémentaires */
  additionalEmailsCount!: Signal<number>;

  constructor(private fb: FormBuilder) {
    // Effect optionnel pour le débogage - s'exécute quand les signals changent
    effect(() => {
      // Cet effect s'exécute chaque fois que submitted ou submitError change
      if (this.submitted()) {
        console.log('[Signal Effect] Formulaire soumis, erreur:', this.submitError());
      }
    });
  }

  ngOnInit(): void {
    // Initialiser le formulaire en utilisant FormBuilder
    // Syntaxe: this.fb.group({ nomChamp: [valeurInitiale, validateurs] })
    this.registrationForm = this.fb.group(
      {
        // Groupe imbriqué: Informations Personnelles
        personalInfo: this.fb.group({
          firstName: ['', [Validators.required, Validators.minLength(2)]],
          lastName: ['', [Validators.required, Validators.minLength(2)]],
          birthDate: ['', Validators.required],
        }),

        // Groupe imbriqué: Informations de Contact
        contactInfo: this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],
          website: ['', Validators.pattern(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)],
        }),

        // Groupe imbriqué: Mots de Passe
        passwords: this.fb.group(
          {
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
          },
          { validators: this.passwordMatchValidator }
        ),

        // FormArray pour emails supplémentaires
        additionalEmails: this.fb.array([]),

        // Termes d'acceptation
        acceptTerms: [false, Validators.requiredTrue],
      }
    );

    // Initialiser les signals computed après la création du formulaire
    this.initComputedSignals();
  }

  /**
   * Initialise les signals computed basés sur l'état du formulaire
   * Ces signals se mettent à jour automatiquement quand le formulaire change
   */
  private initComputedSignals(): void {
    // Convertir les Observables du formulaire en Signals avec toSignal()
    // toSignal() permet d'utiliser les streams RxJS comme des Signals
    this.formValue = toSignal(this.registrationForm.valueChanges, {
      initialValue: this.registrationForm.value
    });

    // Signal pour le statut (VALID, INVALID, PENDING, DISABLED)
    this.formStatus = toSignal(this.registrationForm.statusChanges, {
      initialValue: this.registrationForm.status
    });

    // Signals computed basés sur l'état du formulaire
    // computed() crée un signal dérivé qui se recalcule automatiquement
    this.formValid = computed(() => this.formStatus() === 'VALID');
    this.formDirty = computed(() => this.registrationForm.dirty);
    this.formTouched = computed(() => this.registrationForm.touched);
    
    // Signal pour le nombre d'emails dans le FormArray
    this.additionalEmailsCount = computed(() => this.additionalEmailsArray.length);
  }

  /**
   * Validateur personnalisé: Vérifier que les mots de passe correspondent
   */
  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }
    // if(2 == '2') true, if(2 === '2') false

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Récupérer le groupe d'informations personnelles
   */
  get personalInfoGroup(): FormGroup {
    return this.registrationForm.get('personalInfo') as FormGroup;
  }

  /**
   * Récupérer le groupe d'informations de contact
   */
  get contactInfoGroup(): FormGroup {
    return this.registrationForm.get('contactInfo') as FormGroup;
  }

  /**
   * Récupérer le groupe de mots de passe
   */
  get passwordsGroup(): FormGroup {
    return this.registrationForm.get('passwords') as FormGroup;
  }

  /**
   * Récupérer le FormArray d'emails supplémentaires
   */
  get additionalEmailsArray(): FormArray {
    return this.registrationForm.get('additionalEmails') as FormArray;
  }

  /**
   * Obtenir un contrôle de formulaire comme FormControl
   */
  getEmailControl(index: number): any {
    return this.additionalEmailsArray.at(index);
  }
  addEmail(): void {
    const emailControl = this.fb.control('', [Validators.email, Validators.required]);
    this.additionalEmailsArray.push(emailControl);
  }

  /**
   * Supprimer un email supplémentaire par index
   */
  removeEmail(index: number): void {
    this.additionalEmailsArray.removeAt(index);
  }

  /**
   * Méthode helper pour obtenir le message d'erreur d'un contrôle
   */
  getErrorMessage(fieldPath: string): string {
    const control = this.registrationForm.get(fieldPath);

    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return `Ce champ est requis`;
    }

    if (control.hasError('email')) {
      return 'Veuillez entrer une adresse e-mail valide';
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `La longueur minimale est ${minLength} caractères`;
    }

    if (control.hasError('pattern')) {
      return 'Format invalide';
    }

    if (control.hasError('passwordMismatch')) {
      return 'Les mots de passe ne correspondent pas';
    }

    if (control.hasError('requiredTrue')) {
      return 'Vous devez accepter les conditions';
    }

    return 'Entrée invalide';
  }

  /**
   * Vérifier si un groupe imbriqué est valide
   */
  isGroupValid(groupName: string): boolean {
    const group = this.registrationForm.get(groupName);
    return group ? group.valid && (group.dirty || group.touched) : false;
  }

  /**
   * Vérifier si un groupe imbriqué a des erreurs
   */
  isGroupInvalid(groupName: string): boolean {
    const group = this.registrationForm.get(groupName);
    return group ? group.invalid && (group.dirty || group.touched) : false;
  }

  /**
   * Gérer la soumission du formulaire
   * Utilise les méthodes .set() des Signals pour mettre à jour l'état
   */
  onSubmit(): void {
    // Utiliser .set() pour définir une nouvelle valeur du signal
    this.submitted.set(true);
    this.submitError.set(null);

    // Marquer tous les contrôles comme "touched" pour afficher les erreurs
    this.markFormGroupTouched(this.registrationForm);

    // Vérifier si le formulaire est valide avant la soumission
    if (this.registrationForm.valid) {
      console.log('Formulaire soumis avec données:', this.registrationForm.value);
      // Utiliser .set() au lieu de l'assignation directe
      this.submittedData.set({ ...this.registrationForm.value });

      // Simuler l'envoi au serveur
      // this.userService.registerUser(this.registrationForm.value).subscribe(...)

      // Réinitialiser le formulaire après soumission réussie
      // Décommentez pour réinitialiser:
      // this.registrationForm.reset();
      // this.submitted.set(false);
    } else {
      console.log('Le formulaire est invalide');
      // Utiliser .set() pour définir l'erreur
      this.submitError.set('Veuillez corriger les erreurs du formulaire');
    }
  }

  /**
   * Réinitialiser le formulaire à son état initial
   * Utilise .set() pour réinitialiser tous les signals d'état
   */
  resetForm(): void {
    this.registrationForm.reset();
    
    // Réinitialiser les signals avec .set()
    this.submitted.set(false);
    this.submittedData.set(null);
    this.submitError.set(null);
    
    // Réinitialiser aussi le FormArray
    while (this.additionalEmailsArray.length > 0) {
      this.additionalEmailsArray.removeAt(0);
    }
  }

  /**
   * Pré-remplir le formulaire avec des données de démonstration
   */
  prefillForm(): void {
    this.registrationForm.patchValue({
      personalInfo: {
        firstName: 'Jean',
        lastName: 'Dupont',
        birthDate: '1990-01-15',
      },
      contactInfo: {
        email: 'jean.dupont@example.com',
        phone: '+33 6 12 34 56 78',
        website: 'https://jeandupont.com',
      },
      passwords: {
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      },
      acceptTerms: true,
    });
  }

  /**
   * Basculer la visibilité du champ mot de passe
   * Utilise .update() pour modifier la valeur basée sur la valeur précédente
   */
  togglePasswordField(): void {
    // .update() prend une fonction qui reçoit la valeur actuelle
    // et retourne la nouvelle valeur
    this.showPassword.update(current => !current);
  }

  /**
   * Marquer tous les contrôles du groupe comme "touched"
   * Cela force l'affichage de tous les messages d'erreur
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  /**
   * Obtenir l'état du formulaire pour le débogage
   * Combine les signals et les propriétés du formulaire
   */
  getFormState(): any {
    return {
      // Propriétés du FormGroup
      valid: this.registrationForm.valid,
      invalid: this.registrationForm.invalid,
      dirty: this.registrationForm.dirty,
      touched: this.registrationForm.touched,
      pristine: this.registrationForm.pristine,
      untouched: this.registrationForm.untouched,
      // Valeurs des Signals (appeler le signal pour obtenir sa valeur)
      submitted: this.submitted(),
      submitError: this.submitError(),
      showPassword: this.showPassword(),
    };
  }

  /**
   * Obtenir l'état complet via les Signals computed
   * Cette méthode montre comment accéder aux valeurs des signals
   */
  getSignalState(): any {
    return {
      formValid: this.formValid(),
      formDirty: this.formDirty(),
      formTouched: this.formTouched(),
      formStatus: this.formStatus(),
      additionalEmailsCount: this.additionalEmailsCount(),
      formValue: this.formValue(),
    };
  }
}
