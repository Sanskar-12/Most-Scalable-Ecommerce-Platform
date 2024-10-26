import { Link } from "react-router-dom"

interface CartItemProps {
  cartItem:any
}

const CartItem = ({
  cartItem
}:CartItemProps) => {

  const {photo,productId,name,price,quantity,stock}=cartItem

  return (
    <div className="cart-item">
      <img src={photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>
    </div>
  )
}

export default CartItem