import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Exemple: Formulaire d'Inscription avec Validation Complète
 * 
 * Ce composant démontre:
 * - Validateurs intégrés et personnalisés (Partie 3)
 * - Validation cross-field (correspondance de mots de passe)
 * - Validation d'email unique (faux serveur, pour démo)
 * - Validateur de force de mot de passe
 * - Gestion complète des erreurs de validation
 * - Feedback utilisateur en temps réel
 */
@Component({
  selector: 'app-registration-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.css',
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  submittedData: any = null;
  passwordStrength = 0;
  emailCheckLoading = false;

  // Emails déjà utilisés (simulation)
  usedEmails = ['test@example.com', 'user@example.com', 'admin@example.com'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email], [this.emailUniqueValidator.bind(this)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        birthDate: ['', [Validators.required, this.ageValidator]],
        gender: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
        newsletter: [true],
      },
      { validators: this.passwordMatchValidator }
    );

    // Surveiller les changements de mot de passe pour la force
    this.registrationForm.get('password')?.valueChanges.subscribe((password: string) => {
      this.passwordStrength = this.calculatePasswordStrength(password);
    });
  }

  /**
   * Validateur personnalisé: Vérifier l'âge (18+ ans)
   */
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18 ? null : { minAge: { requiredAge: 18, actualAge: age } };
  }

  /**
   * Validateur personnalisé: Vérifier la correspondance des mots de passe
   */
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Validateur asynchrone: Vérifier l'unicité de l'email
   */
  emailUniqueValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      // Simuler un délai de réponse serveur
      setTimeout(() => {
        const email = control.value;
        if (!email || this.usedEmails.indexOf(email) === -1) {
          resolve(null); // Email est unique
        } else {
          resolve({ emailTaken: { email } }); // Email est déjà utilisé
        }
      }, 500);
    });
  }

  /**
   * Calculer la force du mot de passe (0-5)
   */
  calculatePasswordStrength(password: string): number {
    let strength = 0;

    if (!password) return 0;

    // Longueur
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;

    // Caractères minuscules
    if (/[a-z]/.test(password)) strength++;

    // Caractères majuscules
    if (/[A-Z]/.test(password)) strength++;

    // Caractères spéciaux et chiffres
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    return Math.min(strength, 5);
  }

  /**
   * Obtenir la couleur de la force du mot de passe
   */
  getPasswordStrengthColor(): string {
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#17a2b8', '#28a745'];
    return colors[this.passwordStrength - 1] || '#ccc';
  }

  /**
   * Obtenir le texte de la force du mot de passe
   */
  getPasswordStrengthText(): string {
    const texts = ['', 'Faible', 'Acceptable', 'Bon', 'Fort', 'Très Fort'];
    return texts[this.passwordStrength] || '';
  }

  /**
   * Gérer la soumission du formulaire
   */
  onSubmit(): void {
    this.submitted = true;
    this.markFormGroupTouched(this.registrationForm);

    if (this.registrationForm.valid) {
      console.log('Formulaire d\'inscription soumis:', this.registrationForm.value);
      this.submittedData = { ...this.registrationForm.value };
    }
  }

  /**
   * Réinitialiser le formulaire
   */
  resetForm(): void {
    this.registrationForm.reset({ newsletter: true });
    this.submitted = false;
    this.submittedData = null;
    this.passwordStrength = 0;
  }

  /**
   * Obtenir le message d'erreur pour un champ
   */
  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);

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

    if (control.hasError('maxlength')) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Maximum ${maxLength} caractères autorisés`;
    }

    if (control.hasError('email')) {
      return 'Email invalide';
    }

    if (control.hasError('emailTaken')) {
      return 'Cet email est déjà utilisé';
    }

    if (control.hasError('minAge')) {
      return 'Vous devez avoir au moins 18 ans';
    }

    if (control.hasError('requiredTrue')) {
      return 'Vous devez accepter les conditions';
    }

    return 'Erreur de validation';
  }

  /**
   * Marquer tous les contrôles comme "touched" pour afficher les erreurs
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
