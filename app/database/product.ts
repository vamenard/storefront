import { createClient } from '@/app/utils/supabase';

export async function findAllProducts() {

  try {
    const supabase = createClient();
    const products = await supabase.from("shopify_product").select();
    return products;
  } catch (error) {
    console.error('Error:', error);
    return {
      status: 500,
      error: 'Error fetching database'
    };
  }

}

export async function syncProducts({ products }) {
  const supabase = createClient();

  try {
    // Clear existing products
    const { error: deleteError } = await supabase
      .from('shopify_product')
      .delete()
      .gt('id', 0);

    if (deleteError) {
      throw deleteError;
    }

    // Prepare products for insertion
    const insertProducts = products.edges.map(({ node }) => ({
      title: node.title,
    }));

    // Insert new products
    const { error: insertError } = await supabase
      .from('shopify_product')
      .insert(insertProducts);

    if (insertError) {
      throw insertError;
    }
  } catch (error) {
    console.error('Error syncing products:', error.message);
    return {
      status: 500,
      error: 'Error syncing products to the database',
    };
  }
}
