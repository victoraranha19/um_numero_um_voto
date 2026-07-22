export function validarNomeCompleto(nome: string): { erro: string } | null {
  if (nome.trim().split(' ').length < 2) {
    return { erro: 'Campo obrigatório' };
  }
  return null;
}

export function validarWhatsapp(whatsapp: string): { erro: string } | null {
  if (whatsapp.replaceAll(/\D/g, '').length < 10) {
    return { erro: 'Campo obrigatório' };
  }
  return null;
}
