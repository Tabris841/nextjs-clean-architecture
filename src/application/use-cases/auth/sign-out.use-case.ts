import { getInjection } from '@/di/container';
import { Cookie } from '@/src/entities/models/cookie';

export function signOutUseCase(
  sessionId: string
): Promise<{ blankCookie: Cookie }> {
  const authenticationService = getInjection('IAuthenticationService');

  return authenticationService.invalidateSession(sessionId);
}
