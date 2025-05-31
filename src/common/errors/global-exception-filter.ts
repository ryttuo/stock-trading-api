import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { IError, PRISMA_ERROR_CODES } from '../types/interfaces';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception);
      status = prismaError.status;
      message = prismaError.message;
    }

    Logger.error(exception);

    const responseError: IError = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseError);
  }

  private handlePrismaError(exception: PrismaClientKnownRequestError) {
    switch (exception.code) {
      case PRISMA_ERROR_CODES.RECORD_NOT_FOUND:
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found',
        };
      case PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED:
        return {
          status: HttpStatus.CONFLICT,
          message: 'Record already exists',
        };
      case PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT_FAILED:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Foreign key constraint failed',
        };
      case PRISMA_ERROR_CODES.CONSTRAINT_FAILED:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Constraint validation failed',
        };
      case PRISMA_ERROR_CODES.INVALID_VALUE:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid value provided',
        };
      case PRISMA_ERROR_CODES.CONNECTED_RECORDS_NOT_FOUND:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Connected records not found',
        };
      case PRISMA_ERROR_CODES.REQUIRED_FIELD_MISSING:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Required field is missing',
        };
      case PRISMA_ERROR_CODES.INVALID_ID:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid ID provided',
        };
      case PRISMA_ERROR_CODES.INCONSISTENT_COLUMN_DATA:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Inconsistent column data',
        };
      case PRISMA_ERROR_CODES.INPUT_ERROR:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Input error',
        };
      case PRISMA_ERROR_CODES.TABLE_NOT_FOUND:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Table not found',
        };
      case PRISMA_ERROR_CODES.COLUMN_NOT_FOUND:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Column not found',
        };
      case PRISMA_ERROR_CODES.TRANSACTION_FAILED:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Transaction failed',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        };
    }
  }
}
