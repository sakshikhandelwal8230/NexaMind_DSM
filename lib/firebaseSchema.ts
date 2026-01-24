// Define your collection schema
export const FIRESTORE_SCHEMA = {
  collections: {
    medicines: {
      name: 'medicines',
      description: 'Medicine inventory',
      fields: {
        id: 'string',
        name: 'string',
        category: 'string', // OTC or Prescription
        currentStock: 'number',
        minThreshold: 'number',
        expiryDate: 'string',
        batchNumber: 'string',
        manufacturer: 'string',
        createdAt: 'timestamp',
        updatedAt: 'timestamp'
      }
    },
    users: {
      name: 'users',
      description: 'User accounts',
      fields: {
        email: 'string',
        name: 'string',
        role: 'string', // admin, pharmacist, user
        phone: 'string',
        active: 'boolean',
        createdAt: 'timestamp',
        lastLogin: 'timestamp'
      }
    },
    alerts: {
      name: 'alerts',
      description: 'System alerts and notifications',
      fields: {
        title: 'string',
        message: 'string',
        severity: 'string', // info, warning, error, critical
        read: 'boolean',
        userId: 'string',
        createdAt: 'timestamp',
        resolvedAt: 'timestamp'
      }
    }
  }
};

// Export for reference in code
export type FirebaseSchema = typeof FIRESTORE_SCHEMA;
