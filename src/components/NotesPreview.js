import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import "../styles/NotesPreview.scss";

const NotesPreview = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "Guest" });
  
  // UI States
  const [selectedDomain, setSelectedDomain] = useState(null); 
  const [activeFileIndex, setActiveFileIndex] = useState(null); 
  const [fileStructure, setFileStructure] = useState({ frontend: [], backend: [], database: [] });
  const [currentCode, setCurrentCode] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  
  // Animation States
  const [isExiting, setIsExiting] = useState(false); // Controls Logout Animation
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) { navigate("/"); return; }
    setUser(loggedUser);
    fetch(`https://devvault-flask.onrender.com/code/${loggedUser.username}`)
      .then(res => res.json())
      .then(data => setFileStructure({
         frontend: data.frontend || [], backend: data.backend || [], database: data.database || []
      }));
  }, [navigate]);

  const notify = (msg, type) => {
      setToast({ show: true, msg, type });
      setTimeout(() => setToast({ show: false, msg: "", type: "" }), 2500);
  };

  // --- ANIMATED LOGOUT ---
  const handleLogout = () => {
      setIsExiting(true); // Triggers CSS .page-exit
      setTimeout(() => { 
          localStorage.clear(); 
          navigate("/"); 
      }, 600); // Wait for 0.6s animation
  };

  const handleBack = () => {
      setSelectedDomain(null);
      setActiveFileIndex(null);
  };

  // --- FIXED DELETE LOGIC ---
  const deleteFile = (e, indexToDelete) => {
    e.stopPropagation();
    
    const currentList = fileStructure[selectedDomain];
    const fileToDelete = currentList[indexToDelete];
    
    // 1. Remove from UI immediately
    const newList = currentList.filter((_, i) => i !== indexToDelete);
    
    // 2. Adjust Active Index if necessary
    if (activeFileIndex === indexToDelete) {
        // If we deleted the open file, close the editor
        setActiveFileIndex(null);
        setCurrentCode("");
    } else if (activeFileIndex > indexToDelete) {
        // If we deleted a file above, shift index down by 1
        setActiveFileIndex(activeFileIndex - 1);
    }

    setFileStructure({ ...fileStructure, [selectedDomain]: newList });
    
    // 3. API Call
    fetch("https://devvault-flask.onrender.com/code/delete", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, domain: selectedDomain, name: fileToDelete.name })
    });
    
    notify("File Deleted", "delete");
  };

  const saveFile = () => {
    if (activeFileIndex === null) return;
    const list = [...fileStructure[selectedDomain]];
    const file = list[activeFileIndex];
    file.content = currentCode;
    setFileStructure({ ...fileStructure, [selectedDomain]: list });
    
    fetch("https://devvault-flask.onrender.com/code/update", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, domain: selectedDomain, name: file.name, content: currentCode })
    });
    notify("File Updated", "update");
  };

  const createFile = () => {
    if (!newFileName.trim()) return;
    const newFile = { name: newFileName, content: "" };
    const newList = [...fileStructure[selectedDomain], newFile];
    setFileStructure({ ...fileStructure, [selectedDomain]: newList });
    
    fetch("https://devvault-flask.onrender.com/code/add", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.username, domain: selectedDomain, name: newFileName, content: "" })
    });

    setActiveFileIndex(newList.length - 1);
    setCurrentCode("");
    setShowModal(false); setNewFileName("");
    notify("File Created", "success");
  };

  const openFile = (index) => {
      setActiveFileIndex(index);
      setCurrentCode(fileStructure[selectedDomain][index].content || "");
  };

  return (
    <div className={`app-container ${isExiting ? "page-exit" : "page-enter"}`}>
      <div className={`toast ${toast.show ? "show" : ""} ${toast.type}`}>{toast.msg}</div>

      <nav className="navbar">
        <div className="brand" onClick={handleBack}>
            <Logo size={35} /> <span>DevVault</span>
        </div>
        <div className="user-controls">
            <span className="name">{user.username}</span>
            <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* DASHBOARD */}
      {!selectedDomain && (
        <div className="dashboard fade-in">
           <div className="floating-text-container">
              <h2 className="main-title">Select Workspace</h2>
              <p className="subtitle">INNOVATE • BUILD • DEPLOY</p>
           </div>

           <div className="cards-wrapper">
              <div className="card front" onClick={() => {setSelectedDomain("frontend");}}>
                 <div className="icon">🎨</div>
                 <h3>Front-End</h3>
                 <div className="langs">React • Vue • HTML</div>
              </div>
              <div className="card back" onClick={() => {setSelectedDomain("backend");}}>
                 <div className="icon">⚡</div>
                 <h3>Back-End</h3>
                 <div className="langs">Node • Python • Java</div>
              </div>
              <div className="card db" onClick={() => {setSelectedDomain("database");}}>
                 <div className="icon">💾</div>
                 <h3>Database</h3>
                 <div className="langs">SQL • Mongo • Redis</div>
              </div>
           </div>
        </div>
      )}

      {/* EDITOR */}
      {selectedDomain && (
        <div className="editor slide-up">
           <aside className="sidebar">
              <div className="header">
                  <button onClick={handleBack}>← Back</button>
                  <span>{selectedDomain.toUpperCase()}</span>
              </div>
              <div className="file-list">
                 {fileStructure[selectedDomain].map((file, i) => (
                    <div key={i} className={`file-row ${activeFileIndex === i ? 'active' : ''}`}>
                       <span className="fname" onClick={() => openFile(i)}>{file.name}</span>
                       <div className="actions">
                           <button className="btn-open" onClick={() => openFile(i)}>OPEN</button>
                           <button className="btn-del" onClick={(e) => deleteFile(e, i)}>DEL</button>
                       </div>
                    </div>
                 ))}
                 {fileStructure[selectedDomain].length === 0 && <div className="empty-list">No Files</div>}
              </div>
              <button className="add-btn" onClick={() => setShowModal(true)}>+ New File</button>
           </aside>

           <main className="canvas">
              {activeFileIndex !== null ? (
                 <>
                  <div className="toolbar">
                      <span>{fileStructure[selectedDomain][activeFileIndex].name}</span>
                      <button onClick={saveFile}>Save</button>
                  </div>
                  <textarea 
                    value={currentCode} 
                    onChange={e => setCurrentCode(e.target.value)} 
                    spellCheck="false" 
                    placeholder="// Write your code here..."
                  />
                 </>
              ) : <div className="no-select">Select a file to start</div>}
           </main>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
          <div className="modal-bg">
              <div className="modal">
                  <h3>New File</h3>
                  <input autoFocus placeholder="filename.js" value={newFileName} onChange={e => setNewFileName(e.target.value)} />
                  <div className="btns">
                      <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
                      <button className="save" onClick={createFile}>Create</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default NotesPreview;