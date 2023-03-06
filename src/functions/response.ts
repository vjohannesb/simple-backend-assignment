import { Response } from '@/types/http';

export function response(json: Record<string, any>, statusCode = 200): Response {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(json),
  };
}

export function ok(message = 'ok', additionalInfo?: Record<string, any>): Response {
  return response({ message, ...additionalInfo }, 200);
}

export function created(message = 'ok', additionalInfo?: Record<string, any>): Response {
  return response({ message, ...additionalInfo }, 201);
}

export function badRequest(message = 'Bad request.', additionalInfo?: Record<string, any>): Response {
  return response({ message, ...additionalInfo }, 400);
}

export function unauthorized(message = 'Unauthorized.', additionalInfo?: Record<string, any>): Response {
  return response({ message, ...additionalInfo }, 401);
}

export function forbidden(message = 'Forbidden.', additionalInfo?: Record<string, any>): Response {
  return response({ message, ...additionalInfo }, 403);
}

export function notFound(message = 'Not found.', additionalInfo?: Record<string, any>): Response {
  return response({ message, ...additionalInfo }, 404);
}
