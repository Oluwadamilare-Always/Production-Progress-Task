# Production Pipeline Board

This is a lightweight Kanban-style production board built with **Angular signals** and component communication. The app lets you manage ideas through four key stages: **Idea → Prototype → Development → Ship**, with intuitive single and double click interactions for moving items forward and backward.

---

##  How to Run This Project

Follow these steps to set up and run the application locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/production-pipeline-board.git
cd production-pipeline-board


### 2. Install Dependencies
Make sure you have Node.js and Angular CLI installed.

  npm install


### 3. Run the Development Server 
  ng serve



Summary: What This Application Does
  The Production Pipeline Board is a task flow manager inspired by real-world software pipelines. It visually tracks the journey of a task from an idea to shipping, while enforcing logical movement rules between stages.

 Features":
  - Add New Ideas via input field and press Enter

  - Progress Tasks with a single click

  - Send Tasks Back a stage with a double click

  - Feedback Messages guide user interactions

  - Built using Angular Signals for fine-grained reactivity

  - Modular structure with reusable StageComponent

 How It Works
  - Tasks (or “Stage Items”) start in the Idea stage.

  -  A single click on a task moves it forward one stage:

  - Idea → Prototype → Development → Ship

  - A double click moves it backward one stage:

  - Ship → Development → Prototype → Idea

  - Once a task reaches Ship, a congratulatory message is shown.

  - If a task is already in Idea, a double click won’t push it back further — the app prevents invalid moves and displays a helpful message.

  - The app uses signals for state management (no external state libraries required).

 Tech Stack
  - Angular 17+

  - Angular Signals (Reactive state management)

  - TypeScript

  - Component-based architecture