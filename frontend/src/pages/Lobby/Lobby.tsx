import { useMemo } from "react";
import { Table } from "../../components/Table";
import { useGetAllQuery } from "../../store/games/slice";

export default function Lobby() {
  const { data, error, isLoading } = useGetAllQuery();

  const games = useMemo(() => {
    console.log(
      "Lobby: data=",
      data,
      " error=",
      error,
      " isLoading=",
      isLoading,
    );
    if (!data) return [];

    return (
      data?.map((game) => ({
        id: game.id,
        name: game.name,
        description: game.description,
        action: <button>Join</button>,
      })) || []
    );
  }, [data]);

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
        rows={games}
      />
    </div>
  );
}
