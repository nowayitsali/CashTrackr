import Button from "../components/button";
import Card from "../components/card";

function Login() {
  return (
    <div className="bg-[#0F1115] w-full h-screen flex items-center justify-center">
      <Card theme="dark" size="md" className="w-full max-w-md">
        <h1 className="font-pt-serif text-title font-bold">
          Welcome Back
        </h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
        />
        <Button size="md" variant="light">
          login
        </Button>
      </Card>
    </div>
  );
}

export default Login;
