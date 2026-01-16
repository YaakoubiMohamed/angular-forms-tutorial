import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Exemple: Liste de Tâches Dynamique avec FormArray
 * 
 * Ce composant démontre:
 * - FormArray pour les champs dynamiques (Partie 4)
 * - Ajouter/supprimer des tâches dynamiquement
 * - Filtrage et tri des tâches
 * - Gestion des états (complétée, urgente)
 * - Calcul des statistiques
 * - Sauvegarde et chargement
 */
@Component({
  selector: 'app-dynamic-todo-list',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dynamic-todo-list.html',
  styleUrl: './dynamic-todo-list.css',
})
export class DynamicTodoListComponent implements OnInit {
  todoForm!: FormGroup;
  filterType: 'all' | 'completed' | 'pending' | 'urgent' = 'all';
  sortBy: 'date' | 'priority' = 'date';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      todos: this.fb.array([
        this.createTodoControl('Apprendre Angular Formulaires', 'high', false),
        this.createTodoControl('Créer un formulaire réactif', 'high', true),
        this.createTodoControl('Implémenter la validation', 'medium', true),
      ]),
    });
  }

  /**
   * Créer un contrôle de tâche
   */
  createTodoControl(title: string = '', priority: string = 'medium', completed: boolean = false): FormGroup {
    return this.fb.group({
      title: [title, [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: [priority, Validators.required],
      completed: [completed],
      dueDate: [''],
      createdAt: [new Date().toISOString().split('T')[0]],
    });
  }

  /**
   * Récupérer le FormArray de tâches
   */
  get todosArray(): FormArray {
    return this.todoForm.get('todos') as FormArray;
  }

  /**
   * Ajouter une nouvelle tâche
   */
  addTodo(): void {
    this.todosArray.push(this.createTodoControl());
  }

  /**
   * Supprimer une tâche
   */
  removeTodo(index: number): void {
    this.todosArray.removeAt(index);
  }

  /**
   * Basculer l'état complété d'une tâche
   */
  toggleTodoComplete(index: number): void {
    const todo = this.todosArray.at(index);
    todo.get('completed')?.setValue(!todo.get('completed')?.value);
  }

  /**
   * Obtenir les tâches filtrées
   */
  getFilteredTodos(): FormGroup[] {
    let todos = this.todosArray.controls as FormGroup[];

    // Filtrer
    switch (this.filterType) {
      case 'completed':
        todos = todos.filter((t) => t.get('completed')?.value);
        break;
      case 'pending':
        todos = todos.filter((t) => !t.get('completed')?.value);
        break;
      case 'urgent':
        todos = todos.filter((t) => t.get('priority')?.value === 'high' && !t.get('completed')?.value);
        break;
    }

    // Trier
    todos.sort((a, b) => {
      if (this.sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return (
          (priorityOrder as any)[a.get('priority')?.value] -
          (priorityOrder as any)[b.get('priority')?.value]
        );
      }
      return new Date(b.get('createdAt')?.value).getTime() - new Date(a.get('createdAt')?.value).getTime();
    });

    return todos;
  }

  /**
   * Obtenir les statistiques
   */
  getStats(): any {
    const todos = this.todosArray.controls;
    return {
      total: todos.length,
      completed: todos.filter((t) => (t as FormGroup).get('completed')?.value).length,
      pending: todos.filter((t) => !(t as FormGroup).get('completed')?.value).length,
      urgent: todos.filter(
        (t) =>
          (t as FormGroup).get('priority')?.value === 'high' &&
          !(t as FormGroup).get('completed')?.value
      ).length,
    };
  }

  /**
   * Obtenir la couleur de priorité
   */
  getPriorityColor(priority: string): string {
    const colors: { [key: string]: string } = {
      high: '#dc3545',
      medium: '#ffc107',
      low: '#28a745',
    };
    return colors[priority] || '#6c757d';
  }

  /**
   * Marquer toutes les tâches comme complétées
   */
  completeAll(): void {
    this.todosArray.controls.forEach((todo) => {
      (todo as FormGroup).get('completed')?.setValue(true);
    });
  }

  /**
   * Réinitialiser les filtres
   */
  resetFilters(): void {
    this.filterType = 'all';
    this.sortBy = 'date';
  }

  /**
   * Exporter les données
   */
  exportData(): void {
    const data = this.todoForm.value;
    console.log('Données exportées:', data);
    alert('Données exportées dans la console (F12)');
  }

  /**
   * Obtenir le message d'erreur
   */
  getErrorMessage(fieldName: string): string {
    if (fieldName === 'title') {
      return 'Le titre doit avoir au moins 3 caractères';
    }
    return 'Erreur de validation';
  }
}
