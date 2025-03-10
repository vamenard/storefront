import Image from "next/image";
import { getAllProducts, getAllOrders } from "../app/utils/shopify";

export const getServerSideProps = async () => {
  const orders = await getAllOrders();
  const products = await getAllProducts();
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
    {products.body.data.products.edges.map((datafetch, index) => (
      <p>{datafetch.node.title}</p>
    ))}
    </div>
    <div style={{ float: 'right', width: '50%' }}><h3>Orders</h3>
    {orders.body.data.orders.edges.map((datafetch, index) => (
      <p>{datafetch.node.id}</p>
    ))}
    </div>
    </div>
  );	  
}

