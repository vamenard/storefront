import { createClient } from '@/app/utils/supabase';

export async function findAllOrders() {

  try {
    const supabase = createClient();
    const orders = await supabase.from("shopify_order").select();
    return orders;
  } catch (error) {
    console.error('Error:', error);
    return {
      status: 500,
      error: 'Error fetching database'
    };
  }

}

export async function syncOrders({ orders }) {
  const supabase = createClient();

  try {
    // Delete existing orders
    const { error: deleteError } = await supabase
      .from('shopify_order')
      .delete()
      .gt('id', 0);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    // Prepare orders for insertion
    const insertOrders = orders.edges.map(({ node }) => ({ gid: node.id }));

    // Insert new orders
    const { error: insertError } = await supabase
      .from('shopify_order')
      .insert(insertOrders);

    if (insertError) {
      throw new Error(insertError.message);
    }
  } catch (error) {
    console.error('Error syncing orders:', error);
    return {
      status: 500,
      error: 'Error syncing orders'
    };
  }
}
