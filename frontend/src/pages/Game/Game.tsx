import { useParams } from "react-router";
import { useGetOneQuery } from "../../store/games/slice";

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();

  const { data: game, isLoading } = useGetOneQuery(Number(gameId));

  // this needs to be behind authentication and authorization
  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div>
      <h1>{game?.name}</h1>
      <p>{game?.description}</p>
    </div>
  );
}
