import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { StageItem } from '../../../../core/models/stage-item.model';

@Component({
  selector: 'app-stage',
  imports: [CommonModule],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss',
})
export class StageComponent implements OnInit {
  // Title of the stage (e.g., "Idea", "Development")
  title = input<string>('');

  // List of items (tasks) in this stage
  items = input<StageItem[]>([]);

  // Output signals for moving items forward or backward
  moveForward = output<StageItem>();
  moveBackward = output<StageItem>();

  // Used to delay single-click to detect double-click
  private clickTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {}

  ngOnInit(): void {}

  // Handles single click: Move item forward
  handleClick(item: StageItem): void {
    this.clearClickTimeout();
    this.clickTimeout = setTimeout(() => {
      this.moveForward.emit({ ...item }); // emit forward move event
    }, 250);
  }

  // Handles double click: Move item backward
  handleDoubleClick(item: StageItem): void {
    this.clearClickTimeout();
    this.moveBackward.emit({ ...item }); // emit backward move event
  }

  // Clears the timeout if needed
  private clearClickTimeout(): void {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
  }
}
