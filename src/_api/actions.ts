'use server';

import { IPayload } from '@lib/types';

export async function getURLPagamento(payload: IPayload): Promise<string> {
  const response: { url: string } = await fetch(
    'https://api.checkout.infinitepay.io/links',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    },
  ).then((v) => v.json());
  return response.url;
}
