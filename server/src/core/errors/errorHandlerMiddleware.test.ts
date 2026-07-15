import { Request, Response, NextFunction } from 'express';
import { errorHandlerMiddleware } from './errorHandlerMiddleware';
import { HttpError, NotFoundError, InternalServerError } from './HttpError';
import { logErrorToFile } from './ErrorsLogger';

// Mock the ErrorsLogger module
jest.mock('./ErrorsLogger', () => ({
  logErrorToFile: jest.fn(),
}));

describe('errorHandlerMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    // Clear mock calls before each test
    (logErrorToFile as jest.Mock).mockClear();
  });

  it('should log the error to a file', () => {
    const error = new Error('Something went wrong');
    errorHandlerMiddleware(error, mockRequest as Request, mockResponse as Response, mockNext);
    expect(logErrorToFile).toHaveBeenCalledWith(error.message, error);
  });

  it('should handle HttpError instances correctly', () => {
    const httpError = new NotFoundError('User not found');
    errorHandlerMiddleware(httpError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(logErrorToFile).toHaveBeenCalledWith(httpError.message, httpError);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found',
    });
  });

  it('should handle generic Errors with a 500 status code', () => {
    const genericError = new Error('Unexpected error');
    errorHandlerMiddleware(genericError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(logErrorToFile).toHaveBeenCalledWith(genericError.message, genericError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error',
    });
  });

  it('should handle HttpError subclasses with specific status codes', () => {
    const internalServerError = new InternalServerError('Database connection failed');
    errorHandlerMiddleware(internalServerError, mockRequest as Request, mockResponse as Response, mockNext);

    expect(logErrorToFile).toHaveBeenCalledWith(internalServerError.message, internalServerError);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Database connection failed',
    });
  });
});
