class apierror extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errorDetails = [], // Renamed to avoid conflict with global `Error`
        stack = ""
    )
     {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errorDetails = errorDetails; // Updated property name
        this.data = null;
        this.success = false;

        // Handle stack trace
        if (stack) {
            this.stack = stack;
        } else {
            // Ensure `Error.captureStackTrace` is used properly
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor);
            } else {
                this.stack = new Error().stack;
            }
        }
    }
}

export { apierror };