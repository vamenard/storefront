import Image from "next/image";
import { getAllProducts, getAllOrders } from '@/app/utils/shopify';
import { findAllProducts, syncProducts } from '@/app/database/product';
import { findAllOrders, syncOrders } from '@/app/database/order';
import React, { useState } from "react";
import "../app/globals.css";

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

  const [isHidden, setIsHidden] = useState(false);
  return (

    <div className="center">
      <div style={{ display: isHidden ? 'none' : 'block' }}>
        <button onClick={() => setIsHidden(!isHidden) }>
         Display Orders 
        </button>
      </div>

      <div style={{ display: isHidden ? 'block' : 'none' }}> 
        <button onClick={() => setIsHidden(!isHidden) }>
         Display Products
      </button>
    </div>

    <div className="mainPanel" style={{ display: 'flex' }}>
      <div style={{ display: isHidden ? 'none' : 'block' }}>
        <h3>Products</h3>
        {products.data.map((product, index) => (
          <div className="row" key={index} style={{ width: '100%' }}>
	    <div className="productTitle" style={{ width:'100%' }}>{product.title}</div> 
	      <div className="rowImage">
	      <div className="image">
	      <Image
              src="/snowboard.jpg"
              alt="Some snowboard"
              width={40}
              height={40}
              />
	      </div>
	      <div className="priceTag"> 199$ </div>
	    </div>
	    <div className="rowDesc" style={{ float: 'right' }}>
	      Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
	      Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
	      Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...
            </div>
	    </div>
        ))}
      </div>
      <div className="row" style={{ display: isHidden ? 'block' : 'none' }}>
        <h3>Orders</h3>
        {orders.data.map((order, index) => (
          <p key={index}>{order.gid}</p>
        ))}
      </div>
    </div>
    </div>
  );
}
