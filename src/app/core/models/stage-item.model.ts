export interface StageItem {
  id: number;
  name: string;
}

// Helper function to ensure proper deserialization of StageItem arrays
export function deserializeStageItems(items: any[]): StageItem[] {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    id: Number(item?.id) || 0,
    name: String(item?.name || ''),
  }));
}
