let _visible = $state(false);
let _eyebrow = $state('');
let _message = $state('');

export const banner = {
	get visible() {
		return _visible;
	},
	get eyebrow() {
		return _eyebrow;
	},
	get message() {
		return _message;
	},
	success(message: string, eyebrow = '') {
		_message = message;
		_eyebrow = eyebrow;
		_visible = true;
	},
	dismiss() {
		_visible = false;
	}
};
