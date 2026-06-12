const ADMIN_DB_KEY = 'automate-admin-db';

interface AdminDBState {
  systemLogs: any[];
  users: any[];
  providersQueue: any[];
  catalog: any[];
}

export const AdminService = {
  _getDB(): AdminDBState {
    if (typeof window === 'undefined') return { systemLogs: [], users: [], providersQueue: [], catalog: [] };
    const data = localStorage.getItem(ADMIN_DB_KEY);
    if (!data) {
      const initial: AdminDBState = {
        systemLogs: [
          { id: '1', message: 'User Ahmed registered', timestamp: new Date().toISOString() },
          { id: '2', message: 'Merchant Turbo added an item', timestamp: new Date().toISOString() },
        ],
        users: [
          { id: 'client_1', name: 'Client Ahmed', role: 'Client', status: 'Active' },
          { id: 'm1', name: 'Mechanic Marcus', role: 'Mechanic', status: 'Active' },
          { id: 'merch_1', name: 'Merchant Turbo', role: 'Merchant', status: 'Active' },
        ],
        providersQueue: [
          { id: 'prov_1', name: 'Speedy Repairs', type: 'Mechanic', documents: 'Pending Review', status: 'Pending' },
        ],
        catalog: [
          { sku: 'BRK-001', name: 'Ceramic Brake Pads', category: 'Brakes', msrp: 89.99 },
          { sku: 'FIL-002', name: 'High-Flow Engine Oil Filter', category: 'Filters', msrp: 24.99 },
        ]
      };
      localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  _saveDB(state: AdminDBState) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(state));
    }
  },

  async getSystemLogs() {
    const db = this._getDB();
    return db.systemLogs;
  },

  async getUsers() {
    const db = this._getDB();
    return db.users;
  },

  async updateUserStatus(userId: string, status: 'Active' | 'Suspended') {
    const db = this._getDB();
    db.users = db.users.map(u => u.id === userId ? { ...u, status } : u);
    
    // Log the action
    db.systemLogs.unshift({
      id: Math.random().toString(),
      message: `Admin ${status === 'Suspended' ? 'suspended' : 'activated'} account: ${userId}`,
      timestamp: new Date().toISOString()
    });

    this._saveDB(db);
    return true;
  },

  async getProvidersQueue() {
    const db = this._getDB();
    return db.providersQueue;
  },

  async verifyProvider(providerId: string, action: 'Approved' | 'Rejected') {
    const db = this._getDB();
    db.providersQueue = db.providersQueue.map(p => 
      p.id === providerId ? { ...p, status: action } : p
    );

    // Log the action
    db.systemLogs.unshift({
      id: Math.random().toString(),
      message: `Admin ${action} provider: ${providerId}`,
      timestamp: new Date().toISOString()
    });

    this._saveDB(db);
    return true;
  },

  async getCatalog() {
    const db = this._getDB();
    return db.catalog;
  },

  async addCatalogItem(item: any) {
    const db = this._getDB();
    db.catalog.push(item);
    db.systemLogs.unshift({
      id: Math.random().toString(),
      message: `Admin added new SKU to catalog: ${item.sku}`,
      timestamp: new Date().toISOString()
    });
    this._saveDB(db);
    return true;
  }
};
