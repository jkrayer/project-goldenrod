import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Field } from "../components/FormFields";
import { login } from "../store/user";
import type { AppDispatch } from "../store/store";

// TODO add shared validation

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // how do I deal with errors in a sane way?
  // 1. Show error messages in the UI
  //   A. Field validation errors
  //   B. General errors
  // 2. Log errors to an external service
  // 3. Ensure sensitive information is not exposed
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password }));
      // Handle successful login (e.g., redirect to dashboard)
      navigate("/lobby");
    } catch (error) {
      // Handle login error (e.g., show error message)
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <Field.Root id="email" required>
          <Field.Label>Email</Field.Label>
          <Field.Input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field.Error>Please enter a valid email.</Field.Error>
        </Field.Root>
        <Field.Root id="password" required>
          <Field.Label>Password</Field.Label>
          <Field.Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Field.Error>Please enter a valid password.</Field.Error>
        </Field.Root>
        <Button type="submit">Login</Button>
      </Form>
    </div>
  );
}
