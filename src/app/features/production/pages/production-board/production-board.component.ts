import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  deserializeStageItems,
  StageItem,
} from '../../../../core/models/stage-item.model';
import { StageComponent } from '../../component/stage/stage.component';

@Component({
  selector: 'app-production-board',
  imports: [CommonModule, StageComponent, FormsModule],
  templateUrl: './production-board.component.html',
  styleUrl: './production-board.component.scss',
})
export class ProductionBoardComponent implements OnInit {
  // Signal states for each stage of the production pipeline
  idea = signal<StageItem[]>([]);
  prototype = signal<StageItem[]>([]);
  development = signal<StageItem[]>([]);
  ship = signal<StageItem[]>([]);
 
  feedbackMessage = signal<string>('');

  // Signal for the input field value to add new ideas
  newItem = signal<string>('');

  // Counter to generate unique IDs for new items
  idCounter = signal<number>(0);

  private readonly STORAGE_KEY = 'production-board-state';

  constructor() {
    // Load saved state on component initialization
    this.loadState();

    // Save state whenever any signal changes
    effect(() => {
      const state = {
        idea: this.idea(),
        prototype: this.prototype(),
        development: this.development(),
        ship: this.ship(),
        idCounter: this.idCounter(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    });
  }

  ngOnInit(): void {}
  // Called during component initialization to restore previous state
  private loadState(): void {
    // 1. Retrieve saved state from localStorage
    const savedState = localStorage.getItem(this.STORAGE_KEY);

    // 2. Proceed only if state exists
    if (savedState) {
      try {
        // 3. Parse JSON string to JavaScript object
        const state = JSON.parse(savedState);

        // 4. Update component signals with deserialized data
        this.idea.set(deserializeStageItems(state.idea));
        this.prototype.set(deserializeStageItems(state.prototype));
        this.development.set(deserializeStageItems(state.development));
        this.ship.set(deserializeStageItems(state.ship));
        this.idCounter.set(Number(state.idCounter) || 0);
      } catch (e) {
        // 5. Handle data corruption
        console.error('Failed to load saved state', e);
        this.clearStorage(); // Prevent future errors with corrupted data
      }
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Adds a new idea to the 'Idea' stage
  addIdea(): void {
    const itemText: string = this.newItem().trim();

    if (itemText) {
      this.idea.update((items) => [
        ...items,
        { id: this.idCounter(), name: itemText },
      ]);
      this.idCounter.set(this.idCounter() + 1); // Increment ID for next item
      this.newItem.set(''); // Reset input field
    }
  }

  // Moves an item forward to the next stage
  moveToNextStage(item: StageItem, currentStage: number): void {
    if (currentStage === 3) {
      this.showFeedback('You have gotten to the final stage. Congratulations!');
      return;
    }

    this.removeItemFromStage(item, currentStage);

    // Determine the next stage to move the item into
    switch (currentStage) {
      case 0:
        this.prototype.update((items) => [...items, item]);
        break;
      case 1:
        this.development.update((items) => [...items, item]);
        break;
      case 2:
        this.ship.update((items) => [...items, item]);
        this.showFeedback('You have arrived at the final stage.');
        break;
    }
  }

  // Moves an item backward to the previous stage
  moveToPreviousStage(item: StageItem, currentStage: number): void {
    if (currentStage === 0) {
      this.showFeedback(
        'This item is already in the initial stage (Idea) and cannot move backward.'
      );
      return;
    }

    this.removeItemFromStage(item, currentStage);

    // Determine the previous stage to move the item into
    switch (currentStage) {
      case 1:
        this.idea.update((items) => [...items, item]);
        break;
      case 2:
        this.prototype.update((items) => [...items, item]);
        break;
      case 3:
        this.development.update((items) => [...items, item]);
        break;
    }
  }

  // Helper method to remove an item from its current stage
  private removeItemFromStage(item: StageItem, stage: number): void {
    const filterItems = (list: StageItem[]) =>
      list.filter((i) => i.id !== item.id); // Remove by unique ID

    switch (stage) {
      case 0:
        this.idea.set(filterItems(this.idea()));
        break;
      case 1:
        this.prototype.set(filterItems(this.prototype()));
        break;
      case 2:
        this.development.set(filterItems(this.development()));
        break;
      case 3:
        this.ship.set(filterItems(this.ship()));
        break;
    }
  }

  // Displays a feedback message to the user temporarily
  private showFeedback(message: string): void {
    this.feedbackMessage.set(message);
    setTimeout(() => this.feedbackMessage.set(''), 9000); // Clear after 9 seconds
  }
}
