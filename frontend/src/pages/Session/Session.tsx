import packageJson from "../../../package.json";

export default function Session() {
  return (
    <div>
      <h1>Session</h1>
      <p>Alpha version {packageJson.version}</p>
    </div>
  );
}
