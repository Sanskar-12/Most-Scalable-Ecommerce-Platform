import { IconType } from "react-icons";
import { AiFillFileText } from "react-icons/ai";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaGamepad,
  FaStopwatch,
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import {
  RiCoupon3Fill,
  RiDashboardFill,
  RiShoppingBag3Fill,
} from "react-icons/ri";
import { Link, Location, useLocation } from "react-router-dom";
import EcommerceLogo from "../assets/images/logo.png"

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside>
      <div className="image-div">
        <img src={EcommerceLogo} alt="Logo" height={"50px"} width={"290px"} />
      </div>
      <DashboardDiv location={location} />
      <ChartsDiv location={location} />
      <AppsDiv location={location} />
    </aside>
  );
};

const DashboardDiv = ({ location }: { location: Location }) => {
  return (
    <div>
      <h5>Dashboard</h5>
      <ul>
        <Li
          url={"/admin/dashboard"}
          location={location}
          text={"Dashboard"}
          Icon={RiDashboardFill}
        />
        <Li
          url={"/admin/product"}
          location={location}
          text={"Product"}
          Icon={RiShoppingBag3Fill}
        />
        <Li
          url={"/admin/customer"}
          location={location}
          text={"Customer"}
          Icon={IoIosPeople}
        />
        <Li
          url={"/admin/transaction"}
          location={location}
          text={"Transaction"}
          Icon={AiFillFileText}
        />
      </ul>
    </div>
  );
};

const ChartsDiv = ({ location }: { location: Location }) => {
  return (
    <div>
      <h5>Charts</h5>
      <ul>
        <Li
          url="/admin/chart/bar"
          text="Bar"
          Icon={FaChartBar}
          location={location}
        />
        <Li
          url="/admin/chart/pie"
          text="Pie"
          Icon={FaChartPie}
          location={location}
        />
        <Li
          url="/admin/chart/line"
          text="Line"
          Icon={FaChartLine}
          location={location}
        />
      </ul>
    </div>
  );
};

const AppsDiv = ({ location }: { location: Location }) => {
  return (
    <div>
      <h5>Apps</h5>
      <ul>
        <Li
          url="/admin/app/stopwatch"
          text="Stopwatch"
          Icon={FaStopwatch}
          location={location}
        />
        <Li
          url="/admin/app/coupon"
          text="Coupon"
          Icon={RiCoupon3Fill}
          location={location}
        />
        <Li
          url="/admin/app/toss"
          text="Toss"
          Icon={FaGamepad}
          location={location}
        />
      </ul>
    </div>
  );
};

interface LiProps {
  url: string;
  location: Location;
  text: string;
  Icon: IconType;
}

const Li = ({ url, location, text, Icon }: LiProps) => {
  return (
    <li
      style={{
        backgroundColor: location.pathname.includes(url)
          ? "rgba(0,115,255,0.1)"
          : "white",
      }}
    >
      <Link
        to={url}
        style={{
          color: location.pathname.includes(url) ? "rgb(0,115,255)" : "black",
        }}
      >
        <Icon />
        {text}
      </Link>
    </li>
  );
};

export default AdminSidebar;
