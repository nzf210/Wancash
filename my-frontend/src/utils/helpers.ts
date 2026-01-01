// frontend/src/utils/helpers.ts
export const shortenAddress = (address?: string, chars = 4): string => {
  if (!address) return ''
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Modern fallback without deprecated execCommand: prompt user to copy manually
    globalThis.window.prompt("Copy to clipboard: Ctrl + C, then Enter", text);
  }
}

import { type DirectiveBinding } from 'vue'

export const vClickOutside = {
  mounted(el: HTMLElement, binding: DirectiveBinding<(event: Event) => void>) {
    const clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event)
      }
    }
    (el as unknown as { clickOutsideEvent: (event: Event) => void }).clickOutsideEvent = clickOutsideEvent
    document.addEventListener('click', clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as unknown as { clickOutsideEvent: (event: Event) => void }).clickOutsideEvent)
  }
}
