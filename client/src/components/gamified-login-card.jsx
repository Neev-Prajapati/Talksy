import {useState, useEffect} from "react"
import { Button } from "./ui/loginbutton"
import { Input } from "./ui/input1"
import { Label } from "./ui/label1"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";


const colors = ["#facc15", "#22c55e", "#3b82f6", "#f472b6", "#f97316"]

export default function GamifiedLoginCard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [particles, setParticles] = useState([])

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (token && savedUser) {
      navigate("/chats", { state: { user: JSON.parse(savedUser) } })
    }
  }, [navigate])

const handleLogin = async () => {
  if (!email || !password) return;

  try {
    const res = await axios.post("/api/users/login", {
      email,
      password,
    });

    const { token, user: userData } = res.data;

    setSuccess(true);

    // Save session to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({
      _id: userData._id,
      firstname: userData.firstname,
      email: userData.email,
    }));

    navigate("/chats", {
      state: {
        user: {
          _id: userData._id,
          firstname: userData.firstname,
          email: userData.email,
        },
      },
    });

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const res = await axios.post("/api/users/google", {
      credential: credentialResponse.credential,
    });

    const { token, user: userData } = res.data;

    setSuccess(true);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({
      _id: userData._id,
      firstname: userData.firstname,
      email: userData.email,
    }));

    navigate("/chats", {
      state: {
        user: {
          _id: userData._id,
          firstname: userData.firstname,
          email: userData.email,
        },
      },
    });
  } catch (err) {
    alert(err.response?.data?.message || "Google login failed");
  }
};


  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Confetti */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: p.color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: p.rotate }}
            animate={{
              x: (Math.random() - 0.5) * 150,
              y: -Math.random() * 200,
              scale: 0,
              opacity: 0,
              rotate: p.rotate + Math.random() * 360,
            }}
            transition={{ duration: 1, ease: "easeOut" }} />
        ))}
      </AnimatePresence>
      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col gap-6">
        <h2
          className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          {success ? "Welcome!" : "Sign In"}
        </h2>

        <div className="flex flex-col gap-4 mt-2">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="hover:scale-105 transition-transform duration-200" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="hover:scale-105 transition-transform duration-200" />
          </div>
        </div>

        <Button
          className="w-full mt-4 hover:scale-110 transition-transform duration-200"
          onClick={handleLogin}>
          {success ? "Logged In!" : "Login"}
        </Button>

        {/* Divider */}
        {!success && (
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            <span className="text-xs text-gray-400 dark:bg-gray-800 dark:text-gray-500 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          </div>
        )}

        {/* Google Sign-In */}
        {!success && (
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Sign-In failed")}
              theme="outline"
              size="large"
              width="100%"
              text="signin_with"
              shape="pill"
            />
          </div>
        )}

        {!success && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-500 hover:underline">Sign up</Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
