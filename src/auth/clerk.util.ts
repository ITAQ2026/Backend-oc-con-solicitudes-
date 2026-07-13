import { createClerkClient, verifyToken } from '@clerk/backend';

/**
 * Verifica un token de sesion de Clerk contra la API de Clerk y devuelve
 * el email primario verificado de la cuenta. Nunca confia en un email
 * enviado por el cliente sin verificar.
 */
export async function obtenerEmailVerificadoDeClerk(
  secretKey: string,
  sessionToken: string,
): Promise<string> {
  const payload = await verifyToken(sessionToken, { secretKey });

  const clerkClient = createClerkClient({ secretKey });
  const usuarioClerk = await clerkClient.users.getUser(payload.sub);

  const email = usuarioClerk.emailAddresses.find(
    (direccion) => direccion.id === usuarioClerk.primaryEmailAddressId,
  )?.emailAddress;

  if (!email) {
    throw new Error('No se pudo obtener el email de la cuenta de Clerk');
  }

  return email.toLowerCase().trim();
}
