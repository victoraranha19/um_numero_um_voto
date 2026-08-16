'use server';

import db from '@api/db';

export async function registrarErro(bodyRequest: string, errorMessage: string) {
  await db`INSERT INTO server_bug (body,error) VALUES (${bodyRequest},${errorMessage})`;
}
