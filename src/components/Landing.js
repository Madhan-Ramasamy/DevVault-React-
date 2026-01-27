import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.scss";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* BACKGROUND ELEMENTS */}
      <div className="floating-shapes">
         <div className="shape shape-1">React</div>
         <div className="shape shape-2">Node</div>
         <div className="shape shape-3">DB</div>
         <div className="shape shape-4">JS</div>
      </div>

      {/* --- UNIFIED BRAND HEADER --- */}
      <nav className="nav-header" style={{position: 'absolute', top: '40px', left: '50px', display: 'flex', gap: '10px', alignItems: 'center', zIndex: 20}}>
        <div className="logo-icon" style={{fontFamily: 'Fira Code', fontWeight: 700, color: '#a855f7', background: 'rgba(168,85,247,0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(168,85,247,0.3)'}}>{`{ }`}</div>
        <span className="logo-text" style={{fontSize: '1.2rem', fontWeight: 700, color: 'white'}}>DevVault</span>
      </nav>

      <div className="hero-content">
        <div className="badge">✨ Version 2.0 Live</div>
        
        <h1>
          Code Your <br />
          <span className="gradient-text">Dream Project.</span>
        </h1>
        

        <div className="cta-group">
          <button className="primary-btn" onClick={() => navigate("/auth")}>
          </button>
          <button className="secondary-btn">Learn More</button>
        </div>

        {/* TERMINAL PREVIEW */}
        <div className="terminal-preview">
          <div className="dots">
             <span className="dot red"></span>
             <span className="dot yellow"></span>
             <span className="dot green"></span>
          </div>
          <div className="code-lines">
            <p><span className="keyword">const</span> <span className="var">future</span> = <span className="string">"Bright"</span>;</p>
            <p><span className="func">console.log</span>(future); <span className="comment">// Output: Bright</span></p>
            <p className="cursor">_</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;