import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Exemple: Introduction aux Formulaires Réactifs
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
 * 
 * Concepts Clés:
 * 1. Le formulaire est défini en TypeScript (approche model-driven)
 * 2. Utilise FormBuilder pour une syntaxe pratique
 * 3. Les validateurs sont définis avec les contrôles
 * 4. Facile à tester et manipuler programmatiquement
 * 5. Supporte les groupes imbriqués et les FormArray
 */
@Component({
  selector: 'app-reactive-form-intro',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reactive-form-intro.html',
  styleUrl: './reactive-form-intro.css',
})
export class ReactiveFormIntro implements OnInit {
  // Objet formulaire - FormGroup fortement typé
  registrationForm!: FormGroup;

  // Suivi de la soumission du formulaire
  submitted = false;
  submittedData: any = null;
  submitError: string | null = null;

  // Visibilité du mot de passe
  showPassword = false;

  constructor(private fb: FormBuilder) {}

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
   */
  onSubmit(): void {
    this.submitted = true;
    this.submitError = null;

    // Marquer tous les contrôles comme "touched" pour afficher les erreurs
    this.markFormGroupTouched(this.registrationForm);

    // Vérifier si le formulaire est valide avant la soumission
    if (this.registrationForm.valid) {
      console.log('Formulaire soumis avec données:', this.registrationForm.value);
      this.submittedData = { ...this.registrationForm.value };

      // Simuler l'envoi au serveur
      // this.userService.registerUser(this.registrationForm.value).subscribe(...)

      // Réinitialiser le formulaire après soumission réussie
      // Décommentez pour réinitialiser:
      // this.registrationForm.reset();
      // this.submitted = false;
    } else {
      console.log('Le formulaire est invalide');
      this.submitError = 'Veuillez corriger les erreurs du formulaire';
    }
  }

  /**
   * Réinitialiser le formulaire à son état initial
   */
  resetForm(): void {
    this.registrationForm.reset();
    this.submitted = false;
    this.submittedData = null;
    this.submitError = null;
    
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
   */
  togglePasswordField(): void {
    this.showPassword = !this.showPassword;
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
   */
  getFormState(): any {
    return {
      valid: this.registrationForm.valid,
      invalid: this.registrationForm.invalid,
      dirty: this.registrationForm.dirty,
      touched: this.registrationForm.touched,
      pristine: this.registrationForm.pristine,
      untouched: this.registrationForm.untouched,
    };
  }
}
