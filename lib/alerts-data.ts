// Shared alerts data for bell icon and alerts page

export interface AlertData {
  id: string
  medicineName: string
  facility: string
  facilityType: "Hospital" | "Pharmacy"
  alertType: "Low" | "Critical"
  quantityLeft: number
  timestamp: string
}

export const sharedAlerts: AlertData[] = [
  {
    id: "1",
    medicineName: "Omeprazole 20mg",
    facility: "City General Hospital",
    facilityType: "Hospital",
    alertType: "Critical",
    quantityLeft: 0,
    timestamp: "2026-01-11T10:30:00",
  },
  {
    id: "2",
    medicineName: "Metformin 500mg",
    facility: "HealthPlus Pharmacy",
    facilityType: "Pharmacy",
    alertType: "Critical",
    quantityLeft: 15,
    timestamp: "2026-01-11T09:45:00",
  },
  {
    id: "3",
    medicineName: "Amoxicillin 250mg",
    facility: "Central Medical Center",
    facilityType: "Hospital",
    alertType: "Low",
    quantityLeft: 45,
    timestamp: "2026-01-11T08:20:00",
  },
  {
    id: "4",
    medicineName: "Insulin Glargine",
    facility: "MedCare Pharmacy",
    facilityType: "Pharmacy",
    alertType: "Critical",
    quantityLeft: 5,
    timestamp: "2026-01-10T16:55:00",
  },
  {
    id: "5",
    medicineName: "Lisinopril 10mg",
    facility: "Regional Hospital",
    facilityType: "Hospital",
    alertType: "Low",
    quantityLeft: 78,
    timestamp: "2026-01-10T14:30:00",
  },
  {
    id: "6",
    medicineName: "Atorvastatin 20mg",
    facility: "Downtown Pharmacy",
    facilityType: "Pharmacy",
    alertType: "Low",
    quantityLeft: 92,
    timestamp: "2026-01-10T11:15:00",
  },
  {
    id: "7",
    medicineName: "Amlodipine 5mg",
    facility: "City General Hospital",
    facilityType: "Hospital",
    alertType: "Critical",
    quantityLeft: 12,
    timestamp: "2026-01-09T17:40:00",
  },
  {
    id: "8",
    medicineName: "Metoprolol 50mg",
    facility: "LifeCare Medical",
    facilityType: "Hospital",
    alertType: "Low",
    quantityLeft: 55,
    timestamp: "2026-01-09T13:25:00",
  },
  {
    id: "9",
    medicineName: "Losartan 50mg",
    facility: "Apollo Pharmacy",
    facilityType: "Pharmacy",
    alertType: "Critical",
    quantityLeft: 3,
    timestamp: "2026-01-09T10:10:00",
  },
  {
    id: "10",
    medicineName: "Pantoprazole 40mg",
    facility: "St. Mary's Hospital",
    facilityType: "Hospital",
    alertType: "Low",
    quantityLeft: 67,
    timestamp: "2026-01-08T15:45:00",
  },
]
