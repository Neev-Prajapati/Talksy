import {useState} from "react"
import { Button } from "./ui/loginbutton"
import { Input } from "./ui/input1"
import { Label } from "./ui/label1"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate } from "react-router-dom";


const colors = ["#facc15", "#22c55e", "#3b82f6", "#f472b6", "#f97316"]

export default function GamifiedLoginCard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [particles, setParticles] = useState([])

const handleLogin = async () => {
  if (!email || !password) return;

  try {
    // 🔹 Call backend login API
    const res = await axios.post("/api/users/login", {
      email,
      password,
    });

    console.log(res.data.message); // "Login successful"


    setSuccess(true);
   const userRes = await axios.get(`/api/users/${res.data.user.id}`);

    navigate("/chats", {
     state: {
    user: userRes.data.user, // ✅ plain JSON only
     },
});


  } catch (err) {
    console.log(err)
    alert(err.response?.data?.message || "Login failed");
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

        {!success && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-300 mt-2">
            Don’t have an account?{" "}
            <Link to="/signup"><a href="#" className="text-purple-500 hover:underline">Sign up</a></Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
