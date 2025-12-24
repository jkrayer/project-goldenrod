import { Link } from "react-router";
import type { Game } from "@project_goldenrod/shared";
import { Button } from "../../components/Button";
import { Table } from "../../components/Table";
import { ADMIN_PATH, GAME_PATH } from "../../routes/routes";
import { useGetAllGamesQuery } from "../../store/games/slice";
import { useCanCreateGame } from "../../store/user";

export default function Lobby() {
  const { data, refetch } = useGetAllGamesQuery(); // error, isLoading
  const canCreate = useCanCreateGame();

  return (
    <div>
      <h1>Lobby</h1>
      {canCreate && <Link to={`/${ADMIN_PATH}`}>Create Game</Link>}
      <Button type="button" onClick={() => refetch()}>
        Refresh
      </Button>
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
