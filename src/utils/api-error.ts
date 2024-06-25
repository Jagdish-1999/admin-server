export interface ApiErrorTypes {
	statusCode: number;
	message?: string;
	errors?: any[];
	stack?: string;
}

class ApiError extends Error {
	statusCode: number;
	data: null;
	success: boolean;
	errors: any[];

	constructor({
		statusCode,
		message = "Something went wrong",
		errors = [],
		stack = "",
	}: ApiErrorTypes) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.data = null;
		this.success = false;
		this.errors = errors;

		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export { ApiError };
