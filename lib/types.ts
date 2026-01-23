export type Category = "OTC" | "Prescription"
export type StockStatus = "available" | "low" | "critical"

export interface InventoryItem {
  id: string
  name: string
  category: Category
  batch: string
  qty: number
  minThreshold: number
  expiryDate: string // ISO date string
  status: StockStatus
}

export interface Transfer {
  id: string
  itemId: string
  fromFacility: string
  toFacility: string
  quantity: number
  status: "pending" | "completed"
}

export interface Alert {
  id: string
  itemId: string
  type: "low_stock" | "critical" | "expiring"
  message: string
  resolved: boolean
}

export interface ReorderItem {
  id: string
  itemId: string
  quantity: number
  status: "pending" | "ordered"
}
