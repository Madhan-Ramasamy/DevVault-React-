import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// NO AXIOS IMPORT NEEDED
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
      // USING FETCH INSTEAD OF AXIOS
      const response = await fetch(`https://devvault-flask.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedUser", JSON.stringify({ username: form.username }));
        navigate("/home");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      setError("Connection failed. Is backend running?");
    }
  };

  return (
    <div className="auth-page">
      <div className="brand-header">
        <div className="logo-icon">{`{ }`}</div>
        <span className="logo-text">DevVault</span>
      </div>

      <div className="auth-container">
        <div className="auth-visuals">
          <div className="code-window">
             <div className="window-header">
                <div className="dots"><span className="red"></span><span className="yellow"></span><span className="green"></span></div>
             </div>
             <div className="code-area">
               <pre><code>// Secure Login<br/>Auth.authenticate(user);<span className="cursor">|</span></code></pre>
             </div>
          </div>
          <div className="visual-text">
             <h2>{isSignup ? "Join the Vault" : "Welcome Back"}</h2>
          </div>
        </div>



        <div className="auth-form-side">
          <div className="form-content">
            <h2>{isSignup ? "Create Account" : "Login"}</h2>
            {error && <div className="auth-error" style={{color: '#f87171', marginBottom: '10px'}}>{error}</div>}
            
            <input type="text" name="username" placeholder="Username" onChange={handleChange}/>
            <input type="password" name="password" placeholder="Password" onChange={handleChange}/>
            
            <button className="auth-btn" onClick={handleAuth}>
              {isSignup ? "Sign Up" : "Login"}
            </button>
            
            <p className="toggle-text" onClick={() => setIsSignup(!isSignup)} style={{marginTop: '20px', cursor: 'pointer', color: '#94a3b8'}}>
               {isSignup ? "Already have an account? Login" : "New here? Create Account"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;