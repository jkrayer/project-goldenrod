import { useParams } from "react-router";

export default function Game() {
  const { gameId } = useParams<{ gameId: string }>();
  // this needs to be behind authentication and authorization
  return <div>Game Page: {gameId}</div>;
}
