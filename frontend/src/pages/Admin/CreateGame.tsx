import { useEffect, useState } from "react";
import { Link } from "react-router";
import { type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import type { ErrorResponse } from "@project_goldenrod/shared";
import { Button } from "../../components/Button";
import { Form } from "../../components/Form";
import { Field } from "../../components/FormFields";
import { LOBBY_PATH } from "../../routes/routes";
import { useCreateGameMutation } from "../../store/games/slice";

export default function Admin() {
  // STATE
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // HOOKS
  const [createGame, { error, isError, isLoading, isSuccess }] =
    useCreateGameMutation();

  // e: React.FormEvent
  const handleSubmit = () => createGame({ name, description });

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
        <Field.Root id="name" required>
          <Field.Label>Name</Field.Label>
          <Field.Input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-disabled={isLoading}
          />
          <Field.Error>Please enter a valid name.</Field.Error>
        </Field.Root>
        <Field.Root id="description">
          <Field.Label>Description</Field.Label>
          <Field.TextArea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-disabled={isLoading}
          />
        </Field.Root>
        <Button type="submit" aria-disabled={isLoading}>
          Create Game
        </Button>
      </Form>
      {SUCCESS}
    </>
  );
}
