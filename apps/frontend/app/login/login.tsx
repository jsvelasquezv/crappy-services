import { useFetcher } from 'react-router';

export function Login() {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;
  return (
    <fetcher.Form method="post">
      <p>
        <input type="email" name="email" />
        {errors?.email ? <em>{errors.email}</em> : null}
      </p>

      <p>
        <input type="password" name="password" />
        {errors?.password ? <em>{errors.password}</em> : null}
      </p>

      <button type="submit">Sign Up</button>
    </fetcher.Form>
  );
}
