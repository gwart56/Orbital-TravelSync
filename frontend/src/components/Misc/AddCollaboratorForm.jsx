import { useState } from "react";
import { addCollaborator, findUserByEmail } from "../../lib/supabaseCollaborator";

export function AddCollaboratorForm({ itineraryId }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function handleAddCollaborator() {
    setStatus("Looking up user...");
    const user = await findUserByEmail(email);
    if (!user) {
      setStatus("User not found.");
      return;
    }

    try {
      await addCollaborator(itineraryId, user.id, "viewer");
      setStatus("Collaborator added!");
      setEmail("");
    } catch (error) {
      setStatus("Error adding collaborator.");
    }
  }

  return (
    <div>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleAddCollaborator}>Invite</button>
      <p>{status}</p>
    </div>
  );
}
