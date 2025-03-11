import { findAllProducts, syncProducts } from '../app/database/product';
import { createClient } from '../app/utils/supabase';

jest.mock('../app/utils/supabase');

describe('Database Connector', () => {
  let supabase;

  beforeEach(() => {
    supabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn(),
      delete: jest.fn(),
      insert: jest.fn(),
    };
    createClient.mockReturnValue(supabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllProducts', () => {
    it('should return products from the database', async () => {
      const mockProducts = [{ id: 1, title: 'Product 1' }, { id: 2, title: 'Product 2' }];
      supabase.select.mockResolvedValue(mockProducts);

      const products = await findAllProducts();

      expect(supabase.from).toHaveBeenCalledWith('shopify_product');
      expect(supabase.select).toHaveBeenCalled();
      expect(products).toEqual(mockProducts);
    });

    it('should handle errors and return an error object', async () => {
      const mockError = new Error('Database error');
      supabase.select.mockRejectedValue(mockError);

      const result = await findAllProducts();

      expect(supabase.from).toHaveBeenCalledWith('shopify_product');
    });
  
  });

  describe('syncProducts', () => {
    it('should clear existing products and insert new products', async () => {
      const mockProducts = {
        edges: [
          { node: { title: 'Product 1' } },
          { node: { title: 'Product 2' } },
        ],
      };

      supabase.delete.mockResolvedValue({});
      supabase.insert.mockResolvedValue({});

      await syncProducts({ products: mockProducts });

      expect(supabase.from).toHaveBeenCalledWith('shopify_product');
      expect(supabase.delete).toHaveBeenCalled();
    });

    it('should handle errors during insertion and return an error object', async () => {
      supabase.delete.mockResolvedValue({});
      const mockError = new Error('Insert error');
      supabase.insert.mockRejectedValue(mockError);

      const result = await syncProducts({ products: { edges: [{ node: { title: 'Product 1' } }] } });

      expect(result).toEqual({
        status: 500,
        error: 'Error syncing products to the database',
      });
    });
    
  });
});
