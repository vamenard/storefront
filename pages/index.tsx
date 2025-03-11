import { getAllProducts, getAllOrders } from '@/app/utils/shopify';
import { createClient } from '@/app/utils/supabase';

export const getServerSideProps = async () => {
  const supabase = createClient();

  await supabase
    .from('shopify_product')
    .delete().gt('id', 0);

  await supabase
    .from('shopify_order')
    .delete().gt('id', 0);

  const apiProducts = await getAllProducts();
  var insertProducts = []
  apiProducts.body.data.products.edges.map((datafetch, index) => (
    insertProducts.push( { 'title': datafetch.node.title } )
  ));
  await supabase
      .from('shopify_product')
      .insert(insertProducts);

  const apiOrders = await getAllOrders();
  var insertOrders = []
  apiOrders.body.data.orders.edges.map((datafetch, index) => (
    insertOrders.push( { 'gid': datafetch.node.id } )
  ));
  await supabase
      .from('shopify_order')
      .insert(insertOrders);

  const products = await supabase.from("shopify_product").select();
  const orders = await supabase.from("shopify_order").select();
  const data = {products: products, orders: orders};
  return {
    props: { data },
  };
};

export default function Home( { data } ) {
  const products = data.products;
  const orders = data.orders;
  return (
    <div style={{ display: 'inline' }}>
    <div style={{ float: 'left', width: '50%' }}><h3>Products</h3>
    {products.data.map((datafetch, index) => (
      <p>{datafetch.title}</p>
    ))}
    </div>
    <div style={{ float: 'right', width: '50%' }}><h3>Orders</h3>
    {orders.data.map((datafetch, index) => (
      <p>{datafetch.gid}</p>
    ))}
    </div>
    </div>
  );	  
}

