export type TransferPriority = "Normal" | "High" | "Critical";
export type TransferStatus = "Requested" | "Approved" | "In Transit" | "Delivered" | "Rejected";

export type TransferRequestItem = {
  name: string;
  batchNo?: string;
  requestedQty: number;
  currentQty: number;
  threshold: number;
};

export type TransferRequest = {
  id: string;
  createdAt: string; // ISO string
  from: string;
  to: string;
  priority: TransferPriority;
  status: TransferStatus;
  notes?: string;
  items: TransferRequestItem[];
};

export type ReorderItem = {
  id: string;
  medicine: string;
  batchNo?: string;
  currentStock: number;
  threshold: number;
  suggestedQty: number;
  reason: string;
  createdAt: string;
};

const TRANSFER_REQUESTS_KEY = "dms_transfer_requests";
const REORDER_LIST_KEY = "dms_reorder_list";

export function getTransferRequests(): TransferRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(TRANSFER_REQUESTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading transfer requests:", error);
    return [];
  }
}

export function addTransferRequest(req: TransferRequest): TransferRequest[] {
  const requests = getTransferRequests();
  requests.unshift(req); // Add to top
  if (typeof window !== "undefined") {
    localStorage.setItem(TRANSFER_REQUESTS_KEY, JSON.stringify(requests));
  }
  return requests;
}

export function updateTransferRequestStatus(id: string, status: TransferStatus): TransferRequest[] {
  const requests = getTransferRequests();
  const updated = requests.map(req =>
    req.id === id ? { ...req, status } : req
  );
  if (typeof window !== "undefined") {
    localStorage.setItem(TRANSFER_REQUESTS_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function emitTransferUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("dms_transfer_updated"));
  }
}

export function subscribeTransferRequests(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === TRANSFER_REQUESTS_KEY) {
      listener();
    }
  };

  const handleCustom = () => {
    listener();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("dms_transfer_updated", handleCustom);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("dms_transfer_updated", handleCustom);
  };
}

// Reorder list functions
export function getReorderList(): ReorderItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(REORDER_LIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading reorder list:", error);
    return [];
  }
}

export function addToReorderList(item: ReorderItem): ReorderItem[] {
  const list = getReorderList();

  // Prevent duplicates (same medicine + batch)
  const existingIndex = list.findIndex(existing =>
    existing.medicine === item.medicine && existing.batchNo === item.batchNo
  );

  if (existingIndex >= 0) {
    // Update existing item
    list[existingIndex] = item;
  } else {
    // Add new item to top
    list.unshift(item);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(REORDER_LIST_KEY, JSON.stringify(list));
  }
  return list;
}

// CSV export function
export function downloadCSV(filename: string, rows: Record<string, string | number>[]): void {
  if (typeof window === "undefined" || rows.length === 0) return;

  // Get headers from first row
  const headers = Object.keys(rows[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
