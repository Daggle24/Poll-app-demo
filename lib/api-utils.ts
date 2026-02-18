export function apiError (message: string, status: number = 400): Response {
  return Response.json({ error: message }, { status })
}

export function apiValidationError (message: string): Response {
  return apiError(message, 400)
}

export function apiNotFound (message: string = 'Not found'): Response {
  return apiError(message, 404)
}

export function apiUnauthorized (message: string = 'Unauthorized'): Response {
  return apiError(message, 401)
}

export function apiForbidden (message: string = 'Forbidden'): Response {
  return apiError(message, 403)
}

export function apiServerError (message: string = 'Internal server error'): Response {
  return apiError(message, 500)
}
