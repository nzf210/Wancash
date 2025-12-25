function formatHexAddress(text: string): string {
  console.log('start Wirh =>',text);
  if (text.startsWith("0x")) {
    const start = text.slice(0, 5);
    const end = text.slice(-4);
    return `${start}...${end}`;
  }
  return text;
}

export { formatHexAddress };
