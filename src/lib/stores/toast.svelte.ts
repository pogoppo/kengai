const DURATION = 4000;

interface ToastItem {
	id: number;
	message: string;
}

class ToastState {
	toasts = $state<ToastItem[]>([]);
	#nextId = 0;
	get duration() {
		return DURATION;
	}

	show(message: string) {
		const id = this.#nextId++;
		this.toasts.push({ id, message });
		setTimeout(() => this.dismiss(id), this.duration);
	}

	dismiss(id: number) {
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}
}

export const toastState = new ToastState();
