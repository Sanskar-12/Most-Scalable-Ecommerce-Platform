import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import EcommerceLogo from "../assets/images/logo.png";
import { useState } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      signOut(auth);
      toast.success("Logged out Successfully.");
      navigate("/login");
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Logged Out Failed.");
    }
  };

  return (
    <nav className="header">
      <div className="first-div">
        <img src={EcommerceLogo} alt="Logo" height={"50px"} width={"290px"} />
      </div>
      <div className="second-div">
        <Link to={"/"} onClick={() => setOpen(false)}>
          HOME
        </Link>
        <Link to={"/search"} onClick={() => setOpen(false)}>
          <FaSearch />
        </Link>
        <Link to={"/cart"} onClick={() => setOpen(false)}>
          <FaShoppingBag />
        </Link>
        {user?._id ? (
          <>
            <button onClick={() => setOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog open={open}>
              <div>
                {user.role === "admin" && (
                  <Link to={"/admin/dashboard"} onClick={() => setOpen(false)}>
                    Admin
                  </Link>
                )}
                <Link to={"/orders"} onClick={() => setOpen(false)}>
                  Orders
                </Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <Link to={"/login"}>
            <FaSignInAlt />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
