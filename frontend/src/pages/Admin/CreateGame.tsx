import { useEffect, useState } from "react";
import { Link } from "react-router";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import {
  gameValidation,
  type ErrorResponse,
  type GamePayload,
} from "@project_goldenrod/shared";
import { Button } from "../../components/Button";
import { Form } from "../../components/Form";
import { Field } from "../../components/FormFields";
import { LOBBY_PATH } from "../../routes/routes";
import { useCreateGameMutation } from "../../store/games/slice";
import { useErrorState } from "../../lib/hooks";

export default function Admin() {
  // STATE
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { errors, handleBlur, onBeforeSubmit, isFormValid } = useErrorState(
    { name, description },
    gameValidation,
  );

  // HOOKS
  const [createGame, { error, isError, isLoading, isSuccess }] =
    useCreateGameMutation();

  const handleSubmit = async () => {
    onBeforeSubmit()
      .then((state: GamePayload) => createGame(state))
      .catch(() => {});
  };

  //   EFFECTS
  useEffect(() => {
    if (isSuccess) {
      setName("");
      setDescription("");
    }
  }, [isSuccess]);

  // RENDER
  const SERVER_ERRORS = isError
    ? (error as FetchBaseQueryError & { data: ErrorResponse }).data.errors.map(
        ({ message }, index) => <p key={index}>{message}</p>,
      )
    : null;

  const SUCCESS = isSuccess ? (
    <p>
      Game created successfully!{" "}
      <Link to={`/${LOBBY_PATH}`}>Return to lobby.</Link>
    </p>
  ) : null;

  return (
    <>
      {SERVER_ERRORS}
      <Form onSubmit={handleSubmit}>
        <Field.Root id="name" required hasError={!!errors?.name}>
          <Field.Label>Name</Field.Label>
          <Field.Input
            type="text"
            name="name"
            value={name}
            onBlur={handleBlur("name")}
            onChange={(e) => setName(e.target.value)}
            aria-disabled={isLoading}
          />
          <Field.Error>{errors?.name}</Field.Error>
        </Field.Root>
        <Field.Root id="description" hasError={!!errors?.description}>
          <Field.Label>Description</Field.Label>
          <Field.TextArea
            name="description"
            value={description}
            onBlur={handleBlur("description")}
            onChange={(e) => setDescription(e.target.value)}
            aria-disabled={isLoading}
          />
          <Field.Error>{errors?.description}</Field.Error>
        </Field.Root>
        <Button type="submit" aria-disabled={isLoading || !isFormValid}>
          Create Game
        </Button>
      </Form>
      {SUCCESS}
    </>
  );
}
