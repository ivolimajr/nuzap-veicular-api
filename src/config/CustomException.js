class CustomException extends Error {
  constructor(status, message,data) {
    super(message);
    this.name = this.constructor.name;
    this.status = status || 500;
    this.data = data || null;
    this.stack = new Error().stack;
  }
}

export default CustomException;
