// simple id generator - no external deps
export const generateId = () =>
  'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7);
