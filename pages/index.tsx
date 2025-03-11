import { getAllProducts, getAllOrders } from '@/app/utils/shopify';
import { findAllProducts, syncProducts } from '@/app/database/product';
import { findAllOrders, syncOrders } from '@/app/database/order';

export const getServerSideProps = async () => {

  try {
    await getAllProducts()
      .then(async (apiProducts) => {
        await syncProducts( apiProducts.body.data );
    });
    
    await getAllOrders()
      .then(async (apiOrders) => {
        await syncOrders( apiOrders.body.data );
    });

  } catch (error) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    }
  }

  const products = await findAllProducts();
  const orders = await findAllOrders();

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

