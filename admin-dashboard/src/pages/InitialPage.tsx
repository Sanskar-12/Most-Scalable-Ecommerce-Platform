import { Link } from "react-router-dom"

const InitialPage = () => {
  return (
    <div className="initial">
        <Link to={"/admin/dashboard"}>
        <h1>Click to go to Dashboard</h1>
        </Link>
    </div>
  )
}

export default InitialPage