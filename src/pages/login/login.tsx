export default function Login() {
  return (
    <form>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}