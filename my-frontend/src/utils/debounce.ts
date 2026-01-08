// frontend/src/utils/debounce.ts
export function debounce<Args extends unknown[], Return>(
  func: (...args: Args) => Promise<Return>,
  wait: number
): (...args: Args) => Promise<Return> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isExecuting = false;
  let pendingResolvers: Array<(value: Return) => void> = [];
  let pendingRejectors: Array<(reason?: unknown) => void> = [];

  const execute = async (...args: Args): Promise<Return> => {
    isExecuting = true;
    try {
      const result = await func(...args);
      // Resolve semua pending promises dengan hasil yang sama
      pendingResolvers.forEach(resolve => resolve(result));
      return result;
    } catch (error) {
      // Reject semua pending promises dengan error yang sama
      pendingRejectors.forEach(reject => reject(error));
      throw error;
    } finally {
      isExecuting = false;
      pendingResolvers = [];
      pendingRejectors = [];
    }
  };

  return (...args: Args): Promise<Return> => {
    return new Promise((resolve, reject) => {
      // Clear timeout sebelumnya
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Jika sedang mengeksekusi, tunggu dan gunakan hasil yang sama
      if (isExecuting) {
        pendingResolvers.push(resolve);
        pendingRejectors.push(reject);
        return;
      }

      // Set timeout baru
      timeoutId = setTimeout(async () => {
        try {
          const result = await execute(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, wait);
    });
  };
}
