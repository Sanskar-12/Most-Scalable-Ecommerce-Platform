import { MdError } from "react-icons/md";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="container not-found">
      <MdError />
      <h1>Page Not Found</h1>
      <p>click below to go to home page.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default Page404;
