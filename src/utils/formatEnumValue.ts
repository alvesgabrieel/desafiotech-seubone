// Função para formatar valores do enum para exibição
  export function formatEnumValue(value: string): string {
    return value
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }