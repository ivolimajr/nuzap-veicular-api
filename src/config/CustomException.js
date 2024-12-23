class CustomException extends Error {
  constructor(status, message, userMessage) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
    this.userMessage = userMessage;
    this.stack = new Error().stack;
  }
}

export default CustomException;
