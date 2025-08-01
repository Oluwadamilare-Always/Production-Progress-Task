import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StageItem } from '../../../../core/models/stage-item.model';
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

  // Signal for showing feedback messages to the user
  feedbackMessage = signal<string>('');

  // Signal for the input field value to add new ideas
  newItem = signal<string>('');

  // Counter to generate unique IDs for new items
  idCounter = signal<number>(0);

  constructor() {}

  ngOnInit(): void {}

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
        'This item is already in the initial stage (Idea) and cannot move backward.',
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
