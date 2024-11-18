import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { CartState } from "../types/reducer-types";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  });

  const navigate = useNavigate();

  const { cartItems } = useSelector((state: CartState) => state.cartSlice);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleBack = () => {
    navigate("/cart");
  };

  useEffect(() => {
    if (cartItems.length <= 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  return (
    <div className="shipping">
      <button className="back-btn" onClick={handleBack}>
        <BiArrowBack />
      </button>
      <form onSubmit={handleSubmit}>
        <h1>Shipping Address</h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />
        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select
          required
          name="country"
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Select Country</option>
          <option value="india">India</option>
        </select>
        <input
          required
          type="number"
          placeholder="Pin Code"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Shipping;
