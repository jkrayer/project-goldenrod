import { Button } from "../../components/Button";
import { Form } from "../../components/Form";
import { Field } from "../../components/FormFields";

export default function Admin() {
  return (
    <div>
      <h1>Admin</h1>
      <h2>Create Game</h2>
      <Form onSubmit={() => {}}>
        <Field.Root id="name" required>
          <Field.Label>Name</Field.Label>
          <Field.Input type="text" name="username" />
          <Field.Error>Please enter a valid name.</Field.Error>
        </Field.Root>
        <Field.Root id="description">
          <Field.Label>Description</Field.Label>
          <Field.TextArea name="description" />
        </Field.Root>
        <Button type="submit">Create Game</Button>
      </Form>
    </div>
  );
}
