// import { useMemo } from "react";
import { Link } from "react-router";
import type { Game } from "@project_goldenrod/shared";
import { Table } from "../../components/Table";
import { useGetAllQuery } from "../../store/games/slice";
import { GAME_PATH } from "../../routes/routes";

export default function Lobby() {
  const { data } = useGetAllQuery(); // error, isLoading

  // const games = useMemo(() => {
  //   if (!data) return [];

  //   return (
  //     data?.map((game) => ({
  //       id: game.id,
  //       name: game.name,
  //       description: game.description,
  //     })) || []
  //   );
  // }, [data]);

  return (
    <div>
      <h1>Lobby</h1>
      <Table<Game, "id">
        cols={[
          { key: "name", label: "Name" },
          { key: "description", label: "Description" },
          {
            key: "action",
            label: "",
            render: (game) => <Link to={`/${GAME_PATH}/${game.id}`}>Join</Link>,
          },
        ]}
        rowId="id"
        rows={data || []}
      />
    </div>
  );
}
