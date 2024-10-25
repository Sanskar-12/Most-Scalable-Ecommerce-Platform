import { Link } from "react-router-dom"
import ProductCard from "../components/Product-Card"

const Home = () => {

  const addToCartHandler=()=>{}

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to={"/search"} className="find-more">
          More
        </Link>
      </h1>
      
      <main>
        <ProductCard
          productId="asdfsdf"
          name="Macbook Pro"
          price={100000}
          stock={232}
          addToCartHandler={addToCartHandler}
          photo="https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_UY218_.jpg"
        />
      </main>
    </div>
  )
}

export default Home