import { useState } from "react";
import { addCollaborator, findUserByEmail, checkIfCollaboratorExists } from "../../lib/supabaseCollaborator";

export function AddCollaboratorForm({ itineraryId }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [status, setStatus] = useState("");

  async function handleAddCollaborator() {
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
      setStatus(`✅ Collaborator added as ${role}.`);
      setEmail("");
    } catch (error) {
      console.error("Error adding collaborator:", error);
      setStatus("❌ Error adding collaborator.");
    }
  }

  return (
    <div>
      <h6>Add Collaborators</h6>
      <div className="add-collaborator-form d-flex align-items-center gap-2 justify-content-center">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-2"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="form-select mb-2"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>

        <button className="btn btn-primary mb-2" onClick={handleAddCollaborator}>
          Invite
        </button>
      </div>
      <p className="text-muted">{status}</p>
    </div>
  );
}
