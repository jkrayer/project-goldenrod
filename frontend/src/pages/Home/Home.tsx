import { Link } from "react-router";
import { LOGIN_PATH, REGISTER_PATH } from "../../routes/routes";
import packageJson from "../../../package.json";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Project Goldenrod</h1>
      <p>Alpha version {packageJson.version}</p>

      <p>
        <Link to={`/${LOGIN_PATH}`}>Login</Link> or
        <Link to={`/${REGISTER_PATH}`}>Register</Link>
      </p>
    </div>
  );
}
