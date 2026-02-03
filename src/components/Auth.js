import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo"; 
import "../styles/Auth.scss";

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAuth = async () => {
    setError("");
    const endpoint = isSignup ? "/signup" : "/login";
    try {
      const res = await fetch(`https://devvault-flask.onrender.com${endpoint}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        // Smooth Exit
        document.querySelector('.auth-page').classList.add('exit-mode');
        setTimeout(() => {
            localStorage.setItem("loggedUser", JSON.stringify({ username: form.username }));
            navigate("/home");
        }, 800);
      } else { setError(data.message || "Access Denied"); }
    } catch { setError("System Offline. Check Connection."); }
  };

  return (
    <div className="auth-page">
      {/* SCROLLING CODE BACKGROUND */}
      <div className="code-bg"></div>
      <div className="overlay"></div>

      <div className="auth-card">
        {/* VISUAL SIDE (Desktop) */}
        <div className="visual-side">
           <div className="center-content">
             <Logo size={100} />
             <h1>DevVault</h1>
             <p className="typing"> Initialize_Workspace_Sequence... </p>
           </div>
        </div>

        {/* FORM SIDE */}
        <div className="form-side">
           {/* LOGO FOR MOBILE ONLY */}
           <div className="mobile-logo">
              <Logo size={60} />
           </div>

           <h2>{isSignup ? "New Protocol" : "System Login"}</h2>
           {error && <div className="error-box">⚠️ {error}</div>}
           
           <div className="input-container">
             <input name="username" placeholder="Username" onChange={handleChange} autoComplete="off" />
           </div>
           
           <div className="input-container">
             <input name="password" type="password" placeholder="Password" onChange={handleChange} />
           </div>

           <button className="neon-btn" onClick={handleAuth}>
             {isSignup ? "EXECUTE SIGNUP" : "INITIALIZE LOGIN"}
           </button>
           
           <p className="toggle" onClick={() => setIsSignup(!isSignup)}>
             {isSignup ? "Return to Login" : "Create New Identity"}
           </p>
        </div>
      </div>
    </div>
  );
};
export default Auth;