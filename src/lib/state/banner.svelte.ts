let _visible = $state(false);
let _message = $state('');

export const banner = {
	get visible() {
		return _visible;
	},
	get message() {
		return _message;
	},
	success(msg: string) {
		_message = msg;
		_visible = true;
	},
	dismiss() {
		_visible = false;
	}
};
