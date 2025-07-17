import { useEffect, useState } from "react";
import './AddCollaboratorForm.css';
import { addCollaborator, findUserByEmail, checkIfCollaboratorExists, loadCollaboratorsForItinerary, deleteCollaboratorById, updateCollaboratorRole, findEmailByUserId } from "../../lib/supabaseCollaborator";

function CollaboratorContainer({c, handleDeleteCollaborator, handleUpdateRole, isEditable}) {
    const [collabRole, setCollabRole] = useState(c.role);
    return <div key={c.userId}>
      <div className="d-flex justify-content-center">
        <p className="mx-2 mt-2"><strong>Email: </strong> {c.email} </p>
        {isEditable ? 
          <select
            style={{maxWidth: "100px"}}
            className="form-select mb-2"
            value={collabRole}
            onChange={(e) => {
              const newRole = e.target.value;
              handleUpdateRole(c.userId, c.email, newRole); 
              setCollabRole(newRole);}}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select> 
        : <p className="mx-2 mt-2"><strong>Role: </strong> {c.role} </p>}
        {isEditable && <button className="btn btn-danger mx-2 mb-2 fw-bold" onClick={()=>handleDeleteCollaborator(c.userId, c.email)}>X</button>}
      </div>
    </div>
}

export function AddCollaboratorModal({ itineraryId, onClose, creatorId, isEditable}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [status, setStatus] = useState("");
  const [owner, setOwner] = useState("");
  const [collaborators, setCollaborators] = useState([]);

  const fetchCollabs = async () => {
          try {
            const loadedCs = await loadCollaboratorsForItinerary(itineraryId); //wait to get collabs class obj by id from supabase
            setCollaborators(loadedCs);
          } catch (err) {
            console.error("Failed to load collaborators", err);
          }
        }
  
    useEffect( () => {//FETCH collabs for the current itinId
        fetchCollabs();
      }
      ,[itineraryId]); // Re-fetch collabs when itinId changes

  const fetchOwner = async () => {
          try {
            const loadedOwner = await findEmailByUserId(creatorId); //wait to get email
            setOwner(loadedOwner);
          } catch (err) {
            console.error("Failed to load owner", err);
          }
        }
  
  useEffect( () => {//FETCH collabs for the current itinId
      fetchOwner();
    }
    ,[creatorId]); // Re-fetch collabs when itinId changes

  const handleAddCollaborator = async () => {
    if (!email) {
      setStatus("❌ Please enter an email");
      return;
    }
    setStatus("Looking up user...");
    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      setStatus("❌ User not found.");
      return;
    }

    const alreadyExists = await checkIfCollaboratorExists(itineraryId, user.id);
    if (alreadyExists) {
      setStatus("⚠️ User is already a collaborator.");
      return;
    }

    try {
      await addCollaborator(itineraryId, user.id, role);
      setCollaborators(prev => [...prev, {
        userId: user.id,
        role: role,
        email: normalizedEmail || "Unknown",
      }]);
      setStatus(`✅ Collaborator \'${normalizedEmail}\' added as ${role}.`);
      setEmail("");
    } catch (error) {
      console.error("Error adding collaborator:", error);
      setStatus("❌ Error adding collaborator.");
    }
  };

  const handleClose = () => {
    setEmail("");
    setRole("viewer");
    setStatus("");
    onClose();
  };

  const handleDeleteCollaborator = async (userId, email) => {
    setStatus("Deleting user...");
    const normalizedEmail = email?email.trim().toLowerCase():"Unknown";

    const alreadyExists = await checkIfCollaboratorExists(itineraryId, userId);
    if (!alreadyExists) {
      setStatus("⚠️ User is not a collaborator.");
      return;
    }

    try {
      await deleteCollaboratorById(itineraryId, userId);
      setCollaborators(prev => prev.filter(c => c.userId != userId));
      setStatus(`✅ Collaborator \'${normalizedEmail}\' deleted.`);
      setEmail("");
    } catch (error) {
      console.error("Error deleting collaborator:", error);
      setStatus("❌ Error deleting collaborator.");
    }
  };

  const handleUpdateRole = async (userId, email, newRole) => {
    setStatus(`Updating role of user to ${newRole}...`);
    const normalizedEmail = email?email.trim().toLowerCase():"Unknown";

    const alreadyExists = await checkIfCollaboratorExists(itineraryId, userId);
    if (!alreadyExists) {
      setStatus("⚠️ User is not a collaborator.");
      return;
    }

    try {
      await updateCollaboratorRole(itineraryId, userId, newRole);
      setCollaborators(prev => prev.map(c => c.userId == userId?{...c, role:newRole}:c));
      setStatus(`✅ Updated role of collaborator \'${normalizedEmail}\'.`);
      setEmail("");
    } catch (error) {
      console.error("Error updating collaborator:", error);
      setStatus("❌ Error updating collaborator.");
    }
  };

  const collabElements = collaborators.map((c) => 
    <CollaboratorContainer 
      c={c}
      handleDeleteCollaborator={handleDeleteCollaborator}
      handleUpdateRole={handleUpdateRole}
      isEditable={isEditable}
  />)

  return (
    <div className={`modal fade d-block show`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg">
          <div className="modal-header border-0">
            <h5 className="modal-title">Collaborators</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="p-2 bg-light rounded m-3">
            <div className="d-flex justify-content-center">
              <p className="mx-2"><strong>Email: </strong> {owner?.email} </p>
              <p className="mx-2"><strong>Role: </strong> Owner </p>
            </div>

            {collabElements}
          </div>

          {isEditable && <div className="modal-body">
            <div className="p-3 bg-light rounded">
            <h6>Invite New Collaborators</h6>
            <div className="mb-3 d-flex">
              <label className="form-label mt-2">Email</label>
              <input
                type="email"
                className="form-control mx-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
              <select
                style={{maxWidth: "100px"}}
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            </div>
            {status && <p className="text-muted mt-2">{status}</p>}
          </div>}

          <div className="modal-footer border-0">
            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
            {isEditable && <button className="btn btn-primary" onClick={handleAddCollaborator}>Invite</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollaboratorButton({itineraryId, creatorId, isEditable}){
    const [show, setShow] = useState(false);

    return <>
      <button className="cta-glass-button" onClick={()=>setShow(true)}>👥 Collaborators</button>
      {show && <AddCollaboratorModal itineraryId={itineraryId} onClose={()=>setShow(false)} creatorId={creatorId} isEditable={isEditable}/>}
      </>
}
