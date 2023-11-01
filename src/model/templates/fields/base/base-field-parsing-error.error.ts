export class BaseFieldParsingError extends Error {
  name = 'BaseFieldParsingError';
  constructor(message: any) {
    super(message);
  }
}
