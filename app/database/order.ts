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
  await supabase
    .from('shopify_order')
    .delete().gt('id', 0);

  let insertOrders = []
  orders.edges.map((datafetch, index) => (
    insertOrders.push( { 'gid': datafetch.node.id } )
  ));
  await supabase
      .from('shopify_order')
      .insert(insertOrders);
}

