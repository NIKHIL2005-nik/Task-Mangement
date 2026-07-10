class ApiError extends Error {
    constructor(statuscode,
        message = "Something went wrong",
        errors = []
    ){
        super(message)
        this.statuscode = statuscode
        this.errors = errors
    }
}

export {ApiError}