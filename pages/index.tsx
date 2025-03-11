import { getAllProducts, getAllOrders } from '@/app/utils/shopify';
import { findAllProducts, syncProducts } from '@/app/database/product';
import { findAllOrders, syncOrders } from '@/app/database/order';

export const getServerSideProps = async () => {
  try {
    const apiProducts = await getAllProducts();
    await syncProducts(apiProducts.body.data);

    const apiOrders = await getAllOrders();
    await syncOrders(apiOrders.body.data);
  } catch (error) {
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }

  const products = await findAllProducts();
  const orders = await findAllOrders();

  const data = { products, orders };
  return {
    props: { data },
  };
};

export default function Home({ data }) {
  const { products, orders } = data;
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h3>Products</h3>
        {products.data.map((product, index) => (
          <p key={index}>{product.title}</p>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <h3>Orders</h3>
        {orders.data.map((order, index) => (
          <p key={index}>{order.gid}</p>
        ))}
      </div>
    </div>
  );
}
