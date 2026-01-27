import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotesPreview.scss";

const NotesPreview = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "Guest" });

  // View & UI State
  const [selectedDomain, setSelectedDomain] = useState(null); 
  const [showModal, setShowModal] = useState(false);
  const [menuIndex, setMenuIndex] = useState(null);
  
  // --- NEW: NOTIFICATION STATE ---
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Editor State
  const [activeFileIndex, setActiveFileIndex] = useState(null); 
  const [currentCode, setCurrentCode] = useState(""); 
  const [newFileName, setNewFileName] = useState("");

  const [fileStructure, setFileStructure] = useState({
    frontend: [], backend: [], database: []
  });

  // 1. GET DATA
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (!loggedUser) { navigate("/auth"); return; }
    setUser(loggedUser);

    fetch(`https://devvault-flask.onrender.com/code/${loggedUser.username}`)
      .then(res => res.json())
      .then(data => {
         setFileStructure({
           frontend: data.frontend || [],
           backend: data.backend || [],
           database: data.database || []
         });
      });
  }, [navigate]);

  // --- HELPER: SHOW NOTIFICATION ---
  const showToast = (message, type = "success") => {
    setNotification({ show: true, message, type });
    // Hide after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  // --- API CALLS ---
  const apiCreate = (domain, name) => {
    fetch("https://devvault-flask.onrender.com/code/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, domain, name, content: "" })
    });
  };

  const apiUpdate = (domain, name, content) => {
    fetch("https://devvault-flask.onrender.com/code/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, domain, name, content })
    });
  };

  const apiDelete = (domain, name) => {
    fetch("https://devvault-flask.onrender.com/code/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, domain, name })
    });
  };

  // --- ACTIONS ---

  const handleNewFileClick = () => {
    setNewFileName(""); 
    setShowModal(true); 
  };

  const confirmCreateFile = () => {
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    
    const newFile = { name: name, content: "" };
    const newList = [...fileStructure[selectedDomain], newFile];
    setFileStructure({ ...fileStructure, [selectedDomain]: newList });
    
    apiCreate(selectedDomain, name);
    
    setActiveFileIndex(newList.length - 1);
    setCurrentCode("");
    setShowModal(false);

    // --- SHOW "CREATED" MESSAGE ---
    showToast(`"${name}" Created Successfully`, "success");
  };

  const handleSave = () => {
    if (activeFileIndex !== null) {
      const updatedList = [...fileStructure[selectedDomain]];
      updatedList[activeFileIndex].content = currentCode;
      
      const fileName = updatedList[activeFileIndex].name;
      setFileStructure({ ...fileStructure, [selectedDomain]: updatedList });
      
      apiUpdate(selectedDomain, fileName, currentCode);

      // --- SHOW "UPDATED" MESSAGE ---
      showToast("File Updated Successfully", "update");
    }
  };

  const openFile = (index) => {
    setActiveFileIndex(index);
    setCurrentCode(fileStructure[selectedDomain][index].content || ""); 
  };

  const handleDelete = (e, index) => {
    e.stopPropagation(); 
    const fileToDelete = fileStructure[selectedDomain][index];
    
    const updatedList = fileStructure[selectedDomain].filter((_, i) => i !== index);
    setFileStructure({ ...fileStructure, [selectedDomain]: updatedList });

    apiDelete(selectedDomain, fileToDelete.name);
    
    setMenuIndex(null); 
    if (activeFileIndex === index) {
      setActiveFileIndex(null);
      setCurrentCode("");
    }
    showToast("File Deleted", "delete");
  };

  return (
    <div className="main-layout" onClick={() => setMenuIndex(null)}>
      {/* NOTIFICATION TOAST */}
      <div className={`notification-toast ${notification.show ? "show" : ""} ${notification.type}`}>
        <div className="toast-icon">
          {notification.type === "delete" ? "🗑️" : "✅"}
        </div>
        <div className="toast-msg">{notification.message}</div>
      </div>

      <div className="top-bar">
        <div className="brand">
           <div className="logo">{`{ }`}</div>
           <span>DevVault</span>
        </div>
        <div className="profile">
          <div className="user-badge">{user.username}</div>
          <button onClick={() => {localStorage.clear(); navigate("/");}}>Logout</button>
        </div>
      </div>

      {!selectedDomain && (
        <div className="dashboard-view">
          <div className="header">
            <h2>Select Workspace</h2>
          </div>
          <div className="card-grid">
            <div className="card card-front" onClick={() => setSelectedDomain("frontend")}>
              <div className="icon">⚛️</div>
              <h3>Front-End</h3>
            </div>
            <div className="card card-back" onClick={() => setSelectedDomain("backend")}>
              <div className="icon">🟢</div>
              <h3>Back-End</h3>
            </div>
            <div className="card card-db" onClick={() => setSelectedDomain("database")}>
              <div className="icon">🐬</div>
              <h3>Database</h3>
            </div>
          </div>
        </div>
      )}

      {selectedDomain && (
        <div className="editor-view">
          <div className="sidebar">
            <div className="sidebar-header">
              <button className="back-btn" onClick={() => setSelectedDomain(null)}>←</button>
              <span className="title">{selectedDomain.toUpperCase()}</span>
            </div>

            <div className="file-list">
              {fileStructure[selectedDomain].map((file, i) => (
                <div 
                  key={i} 
                  className={`file-item ${activeFileIndex === i ? "active" : ""}`}
                  onClick={() => openFile(i)}
                >
                  <span className="file-icon">📄</span>
                  <span className="name">{file.name}</span>
                  <div className="menu-trigger" onClick={(e) => { e.stopPropagation(); setMenuIndex(menuIndex === i ? null : i); }}>
                    ⋮
                    {menuIndex === i && (
                      <div className="dropdown">
                        <button onClick={(e) => handleDelete(e, i)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {fileStructure[selectedDomain].length === 0 && <div className="empty">No files</div>}
            </div>
            <button className="add-btn" onClick={handleNewFileClick}>+ New File</button>
          </div>

          <div className="canvas">
            {activeFileIndex !== null ? (
              <>
                <div className="window-bar">
                   <div className="dots"><span></span><span></span><span></span></div>
                   <div className="file-label">{fileStructure[selectedDomain][activeFileIndex].name}</div>
                   <button className="save-btn" onClick={handleSave}>💾 Save</button>
                </div>
                <textarea 
                  placeholder="// Write your code here..." 
                  spellCheck="false"
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                />
              </>
            ) : (
              <div className="no-file-selected">
                <p>Select a file to start editing.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Name Your File</h3>
            <input 
              autoFocus type="text" placeholder="e.g. index.js"
              value={newFileName} onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmCreateFile()}
            />
            <div className="actions">
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="save" onClick={confirmCreateFile}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPreview;