import { create } from 'zustand';
import { table } from '@devvai/devv-code-backend';

// Types
interface Product {
  _id?: string;
  _uid?: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  maxStock: number;
  weight: number;
  dimensions: string;
  supplier: string;
  status: 'active' | 'inactive';
  createdAt?: number;
  updatedAt?: number;
}

interface Order {
  _id?: string;
  _uid?: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'high' | 'normal' | 'low';
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
  createdAt?: number;
  updatedAt?: number;
}

interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

interface InventoryMovement {
  _id?: string;
  _uid?: string;
  productId: string;
  productName: string;
  sku: string;
  movementType: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  notes?: string;
  userId: string;
  createdAt?: number;
}

interface DataState {
  // Data
  products: Product[];
  orders: Order[];
  inventoryMovements: InventoryMovement[];
  
  // Loading states
  isLoadingProducts: boolean;
  isLoadingOrders: boolean;
  isLoadingInventory: boolean;
  
  // Actions - Products
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, '_id' | '_uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Actions - Orders
  loadOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, '_id' | '_uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  
  // Actions - Inventory
  loadInventoryMovements: () => Promise<void>;
  addInventoryMovement: (movement: Omit<InventoryMovement, '_id' | '_uid' | 'createdAt'>) => Promise<void>;
  
  // Computed values
  getLowStockProducts: () => Product[];
  getPendingOrders: () => Order[];
  getOrdersByStatus: (status: Order['status']) => Order[];
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  products: [],
  orders: [],
  inventoryMovements: [],
  isLoadingProducts: false,
  isLoadingOrders: false,
  isLoadingInventory: false,

  // Products actions
  loadProducts: async () => {
    set({ isLoadingProducts: true });
    try {
      // Get products table ID - we need to use the actual table ID from table_list
      const response = await table.getItems('67890258bba22c0a9a5e0b61', {
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      set({ products: response.items, isLoadingProducts: false });
    } catch (error) {
      console.error('Error loading products:', error);
      set({ isLoadingProducts: false });
    }
  },

  addProduct: async (productData) => {
    try {
      const product = {
        ...productData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await table.addItem('67890258bba22c0a9a5e0b61', product);
      
      // Reload products to get the updated list
      await get().loadProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (id, updates) => {
    try {
      const products = get().products;
      const product = products.find(p => p._id === id);
      if (!product || !product._uid) {
        throw new Error('Product not found');
      }

      const updatedProduct = {
        _uid: product._uid,
        _id: id,
        ...updates,
        updatedAt: Date.now()
      };

      await table.updateItem('67890258bba22c0a9a5e0b61', updatedProduct);
      
      // Update local state
      set({
        products: products.map(p => 
          p._id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
        )
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const products = get().products;
      const product = products.find(p => p._id === id);
      if (!product || !product._uid) {
        throw new Error('Product not found');
      }

      await table.deleteItem('67890258bba22c0a9a5e0b61', {
        _uid: product._uid,
        _id: id
      });
      
      // Update local state
      set({
        products: products.filter(p => p._id !== id)
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Orders actions
  loadOrders: async () => {
    set({ isLoadingOrders: true });
    try {
      const response = await table.getItems('67890258bba22c0a9a5e0b62', {
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      set({ orders: response.items, isLoadingOrders: false });
    } catch (error) {
      console.error('Error loading orders:', error);
      set({ isLoadingOrders: false });
    }
  },

  addOrder: async (orderData) => {
    try {
      const order = {
        ...orderData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      await table.addItem('67890258bba22c0a9a5e0b62', order);
      
      // Reload orders to get the updated list
      await get().loadOrders();
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const orders = get().orders;
      const order = orders.find(o => o._id === id);
      if (!order || !order._uid) {
        throw new Error('Order not found');
      }

      await table.updateItem('67890258bba22c0a9a5e0b62', {
        _uid: order._uid,
        _id: id,
        status,
        updatedAt: Date.now()
      });
      
      // Update local state
      set({
        orders: orders.map(o => 
          o._id === id ? { ...o, status, updatedAt: Date.now() } : o
        )
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      const orders = get().orders;
      const order = orders.find(o => o._id === id);
      if (!order || !order._uid) {
        throw new Error('Order not found');
      }

      await table.deleteItem('67890258bba22c0a9a5e0b62', {
        _uid: order._uid,
        _id: id
      });
      
      // Update local state
      set({
        orders: orders.filter(o => o._id !== id)
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Inventory actions
  loadInventoryMovements: async () => {
    set({ isLoadingInventory: true });
    try {
      const response = await table.getItems('67890258bba22c0a9a5e0b63', {
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      set({ inventoryMovements: response.items, isLoadingInventory: false });
    } catch (error) {
      console.error('Error loading inventory movements:', error);
      set({ isLoadingInventory: false });
    }
  },

  addInventoryMovement: async (movementData) => {
    try {
      const movement = {
        ...movementData,
        createdAt: Date.now()
      };
      
      await table.addItem('67890258bba22c0a9a5e0b63', movement);
      
      // Reload inventory movements to get the updated list
      await get().loadInventoryMovements();
    } catch (error) {
      console.error('Error adding inventory movement:', error);
      throw error;
    }
  },

  // Computed values
  getLowStockProducts: () => {
    const products = get().products;
    return products.filter(product => product.stock <= product.minStock);
  },

  getPendingOrders: () => {
    const orders = get().orders;
    return orders.filter(order => order.status === 'pending');
  },

  getOrdersByStatus: (status) => {
    const orders = get().orders;
    return orders.filter(order => order.status === status);
  },
}));