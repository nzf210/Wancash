function formatHexAddress(text: string): string {
  console.log('start Wirh =>',text);
  if (text.startsWith("0x")) {
    const start = text.slice(0, 6); // 6 karakter pertama
    const end = text.slice(-4);     // 4 karakter terakhir
    return `${start}...${end}`;
  }
  return text;
}

export { formatHexAddress };
