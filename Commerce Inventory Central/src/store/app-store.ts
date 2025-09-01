import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Order, InventoryMovement, dataService } from '@/lib/data-service';

interface AppState {
  // Loading states
  isLoading: boolean;
  productsLoading: boolean;
  ordersLoading: boolean;
  
  // Data
  products: Product[];
  orders: Order[];
  inventoryMovements: InventoryMovement[];
  
  // Dashboard stats
  dashboardStats: {
    totalProducts: number;
    lowStockCount: number;
    pendingOrders: number;
    totalRevenue: number;
  };
  
  // Filters and search
  productFilters: {
    search: string;
    category: string;
    status: string;
  };
  
  orderFilters: {
    search: string;
    status: string;
    priority: string;
  };
  
  // Actions
  setLoading: (loading: boolean) => void;
  
  // Product actions
  loadProducts: () => Promise<void>;
  createProduct: (product: Omit<Product, '_id' | '_uid' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (uid: string, id: string) => Promise<void>;
  setProductFilters: (filters: Partial<AppState['productFilters']>) => void;
  
  // Order actions
  loadOrders: () => Promise<void>;
  updateOrderStatus: (uid: string, id: string, status: Order['status'], processedBy?: string) => Promise<void>;
  setOrderFilters: (filters: Partial<AppState['orderFilters']>) => void;
  
  // Dashboard actions
  loadDashboardStats: () => Promise<void>;
  
  // Inventory actions
  loadInventoryMovements: () => Promise<void>;
  recordStockAdjustment: (
    productId: string,
    productSku: string,
    productName: string,
    quantityChange: number,
    currentStock: number,
    reason: string,
    userId: string,
    userName: string,
    unitCost?: number
  ) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoading: false,
      productsLoading: false,
      ordersLoading: false,
      
      products: [],
      orders: [],
      inventoryMovements: [],
      
      dashboardStats: {
        totalProducts: 0,
        lowStockCount: 0,
        pendingOrders: 0,
        totalRevenue: 0
      },
      
      productFilters: {
        search: '',
        category: '',
        status: ''
      },
      
      orderFilters: {
        search: '',
        status: '',
        priority: ''
      },
      
      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Product actions
      loadProducts: async () => {
        set({ productsLoading: true });
        try {
          const products = await dataService.products.getAllProducts();
          set({ products, productsLoading: false });
        } catch (error) {
          console.error('Failed to load products:', error);
          set({ productsLoading: false });
        }
      },
      
      createProduct: async (productData) => {
        set({ isLoading: true });
        try {
          await dataService.products.createProduct(productData);
          // Reload products to get the updated list
          await get().loadProducts();
          set({ isLoading: false });
        } catch (error) {
          console.error('Failed to create product:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      updateProduct: async (product) => {
        set({ isLoading: true });
        try {
          await dataService.products.updateProduct(product);
          // Update the product in the local state
          const products = get().products.map(p => 
            p._id === product._id ? product : p
          );
          set({ products, isLoading: false });
        } catch (error) {
          console.error('Failed to update product:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      deleteProduct: async (uid, id) => {
        set({ isLoading: true });
        try {
          await dataService.products.deleteProduct(uid, id);
          // Remove the product from local state
          const products = get().products.filter(p => p._id !== id);
          set({ products, isLoading: false });
        } catch (error) {
          console.error('Failed to delete product:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      setProductFilters: (filters) => {
        set(state => ({
          productFilters: { ...state.productFilters, ...filters }
        }));
      },
      
      // Order actions
      loadOrders: async () => {
        set({ ordersLoading: true });
        try {
          const orders = await dataService.orders.getAllOrders();
          set({ orders, ordersLoading: false });
        } catch (error) {
          console.error('Failed to load orders:', error);
          set({ ordersLoading: false });
        }
      },
      
      updateOrderStatus: async (uid, id, status, processedBy) => {
        set({ isLoading: true });
        try {
          await dataService.orders.updateOrderStatus(uid, id, status, processedBy);
          // Update the order in local state
          const orders = get().orders.map(order => 
            order._id === id ? { ...order, status, updated_at: new Date().toISOString() } : order
          );
          set({ orders, isLoading: false });
        } catch (error) {
          console.error('Failed to update order status:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      setOrderFilters: (filters) => {
        set(state => ({
          orderFilters: { ...state.orderFilters, ...filters }
        }));
      },
      
      // Dashboard actions
      loadDashboardStats: async () => {
        try {
          const stats = await dataService.analytics.getDashboardStats();
          set({ dashboardStats: stats });
        } catch (error) {
          console.error('Failed to load dashboard stats:', error);
        }
      },
      
      // Inventory actions
      loadInventoryMovements: async () => {
        try {
          const movements = await dataService.inventory.getAllMovements();
          set({ inventoryMovements: movements });
        } catch (error) {
          console.error('Failed to load inventory movements:', error);
        }
      },
      
      recordStockAdjustment: async (
        productId,
        productSku,
        productName,
        quantityChange,
        currentStock,
        reason,
        userId,
        userName,
        unitCost = 0
      ) => {
        set({ isLoading: true });
        try {
          await dataService.inventory.recordStockAdjustment(
            productId,
            productSku,
            productName,
            quantityChange,
            currentStock,
            reason,
            userId,
            userName,
            unitCost
          );
          
          // Reload inventory movements and products
          await Promise.all([
            get().loadInventoryMovements(),
            get().loadProducts()
          ]);
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Failed to record stock adjustment:', error);
          set({ isLoading: false });
          throw error;
        }
      }
    }),
    {
      name: 'inventory-app-store',
      partialize: (state) => ({
        // Only persist filters, not the actual data
        productFilters: state.productFilters,
        orderFilters: state.orderFilters
      })
    }
  )
);