class ApiResponse {
  constructor(statusCode = 200, message = "Successful", data = []) {
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
    };
  }
}

export default ApiResponse;
