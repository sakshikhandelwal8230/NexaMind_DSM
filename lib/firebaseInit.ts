import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Initialize collections with default data
export async function initializeCollections() {
  try {
    console.log('🚀 Initializing Firebase collections...');
    
    // Initialize medicines collection
    await initializeMedicines();
    
    // Initialize users collection
    await initializeUsers();
    
    // Initialize alerts collection
    await initializeAlerts();
    
    console.log('✅ Collections initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing collections:', error);
  }
}

// Initialize medicines collection
async function initializeMedicines() {
  const medicinesRef = collection(db, 'medicines');
  const snapshot = await getDocs(medicinesRef);
  
  // Only initialize if collection is empty
  if (snapshot.empty) {
    console.log('📦 Creating medicines collection...');
    
    const defaultMedicines = [
      {
        id: '1',
        name: 'Paracetamol 500mg',
        category: 'OTC',
        currentStock: 1500,
        minThreshold: 200,
        expiryDate: '2027-06-15',
        batchNumber: 'PCM-2024-001',
        manufacturer: 'Generic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Amoxicillin 250mg',
        category: 'Prescription',
        currentStock: 45,
        minThreshold: 100,
        expiryDate: '2026-03-20',
        batchNumber: 'AMX-2024-045',
        manufacturer: 'Generic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Ibuprofen 400mg',
        category: 'OTC',
        currentStock: 890,
        minThreshold: 150,
        expiryDate: '2027-09-10',
        batchNumber: 'IBU-2024-112',
        manufacturer: 'Generic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Metformin 500mg',
        category: 'Prescription',
        currentStock: 15,
        minThreshold: 50,
        expiryDate: '2026-12-01',
        batchNumber: 'MET-2024-089',
        manufacturer: 'Generic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'Cetirizine 10mg',
        category: 'OTC',
        currentStock: 320,
        minThreshold: 100,
        expiryDate: '2027-04-25',
        batchNumber: 'CET-2024-056',
        manufacturer: 'Generic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6',
        name: 'Omeprazole 20mg',
        category: 'Prescription',
        currentStock: 0,
        minThreshold: 75,
        expiryDate: '2026-08-18',
        batchNumber: 'OMP-2024-033',
        manufacturer: 'Generic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '7',
        name: 'Aspirin 100mg',
        category: 'OTC',
        currentStock: 2200,
        minThreshold: 300,
        expiryDate: '2027-11-30',
        batchNumber: 'ASP-2024-078',
        manufacturer: 'Generic',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '8',
        name: 'Ciprofloxacin 500mg',
        category: 'Prescription',
        currentStock: 28,
        minThreshold: 60,
        expiryDate: '2026-05-12',
        batchNumber: 'CIP-2024-019',
        manufacturer: 'Generic',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    for (const medicine of defaultMedicines) {
      await setDoc(doc(medicinesRef), medicine);
    }
    
    console.log('✅ Medicines collection created with default data');
  }
}

// Initialize users collection
async function initializeUsers() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  if (snapshot.empty) {
    console.log('👥 Creating users collection...');
    
    const defaultUsers = [
      {
        email: 'admin@nexamind.com',
        name: 'Admin User',
        role: 'admin',
        phone: '+1234567890',
        active: true,
        createdAt: new Date(),
        lastLogin: new Date()
      },
      {
        email: 'pharmacist@nexamind.com',
        name: 'Pharmacist User',
        role: 'pharmacist',
        phone: '+0987654321',
        active: true,
        createdAt: new Date(),
        lastLogin: new Date()
      }
    ];
    
    for (const user of defaultUsers) {
      await setDoc(doc(usersRef), user);
    }
    
    console.log('✅ Users collection created with default data');
  }
}

// Initialize alerts collection
async function initializeAlerts() {
  const alertsRef = collection(db, 'alerts');
  const snapshot = await getDocs(alertsRef);
  
  if (snapshot.empty) {
    console.log('🔔 Creating alerts collection...');
    
    const defaultAlerts = [
      {
        title: 'Low Stock Warning',
        message: 'Metformin stock is running low (15 units left)',
        severity: 'warning',
        read: false,
        userId: 'all',
        createdAt: new Date(),
        resolvedAt: null
      },
      {
        title: 'Critical Stock Alert',
        message: 'Omeprazole is out of stock - please reorder',
        severity: 'critical',
        read: false,
        userId: 'all',
        createdAt: new Date(),
        resolvedAt: null
      },
      {
        title: 'Expiry Alert',
        message: 'Ciprofloxacin batch CIP-2024-019 will expire in 5 months',
        severity: 'info',
        read: false,
        userId: 'all',
        createdAt: new Date(),
        resolvedAt: null
      }
    ];
    
    for (const alert of defaultAlerts) {
      await setDoc(doc(alertsRef), alert);
    }
    
    console.log('✅ Alerts collection created with default data');
  }
}
