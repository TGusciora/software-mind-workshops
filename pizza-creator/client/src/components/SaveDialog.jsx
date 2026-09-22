import { useState } from "react";

export default function SaveDialog({ onSave, error, confirmation }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSave(name);
  }

  return (
    <form className="save-dialog" onSubmit={handleSubmit}>
      <h2>Save Your Pizza</h2>
      <label>
        Pizza name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Tex-Mex Special"
        />
      </label>
      <button type="submit">Save my pizza</button>
      {error && <p className="error">{error}</p>}
      {confirmation && (
        <p className="confirmation">
          Saved "{confirmation.name}" for ${confirmation.totalPrice.toFixed(2)}!
        </p>
      )}
    </form>
  );
}
