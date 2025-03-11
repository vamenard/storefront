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
  await supabase
    .from('shopify_product')
    .delete().gt('id', 0);
  
  let insertProducts = []
  products.edges.map((datafetch, index) => (
    insertProducts.push( { 'title': datafetch.node.title } )
  ));
  await supabase
      .from('shopify_product')
      .insert(insertProducts);
}
