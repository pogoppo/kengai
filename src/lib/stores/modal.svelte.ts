import { type Snippet } from 'svelte';

class ModalState {
  isOpen = $state(false);
  content = $state<Snippet | undefined>(undefined);

  open(snippet: Snippet) {
    this.content = snippet;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.content = undefined;
  }
}

export const modalState = new ModalState();
