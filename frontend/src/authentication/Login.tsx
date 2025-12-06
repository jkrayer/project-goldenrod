import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Field } from "../components/FormFields";

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Form onSubmit={() => {}}>
        <Field.Root id="username" required>
          <Field.Label>Username</Field.Label>
          <Field.Input type="text" name="username" />
          <Field.Error>Please enter a valid username.</Field.Error>
        </Field.Root>
        <Field.Root id="password" required>
          <Field.Label>Password</Field.Label>
          <Field.Input type="password" name="password" />
          <Field.Error>Please enter a valid password.</Field.Error>
        </Field.Root>
        <Button type="submit">Login</Button>
      </Form>
    </div>
  );
}
