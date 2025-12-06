import { Table } from "../../components/Table";

export default function Lobby() {
  // on load check if user is authenticated
  // if so, load
  // if not, open login/register modal
  return (
    <div>
      <h1>Lobby</h1>
      <Table
        cols={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          { key: "action", label: "" },
        ]}
        rowId="id"
        rows={[
          {
            id: 1,
            name: "Test Game",
            description: "This is a test game",
            action: <button>Join</button>,
          },
          {
            id: 2,
            name: "Another Game",
            description: "This is another test game",
            action: <button>Join</button>,
          },
        ]}
      />
    </div>
  );
}
