export default function SaveDialog({ name, onNameChange, onSave, saving, error, confirmation }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSave();
  }

  return (
    <form className="save-dialog" onSubmit={handleSubmit}>
      <h2>Save Your Pizza</h2>
      <label htmlFor="pizza-name">Pizza name</label>
      <input
        id="pizza-name"
        type="text"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="e.g. Tex-Mex Special"
      />
      <button type="submit" disabled={saving || Boolean(confirmation)}>
        {saving ? "Saving…" : "Save my pizza"}
      </button>
      <div aria-live="polite">
        {error && <p className="error">{error}</p>}
        {confirmation && (
          <p className="confirmation">
            Saved "{confirmation.name}" ({confirmation.size}) for $
            {confirmation.totalPrice.toFixed(2)}! Change anything above to save another.
          </p>
        )}
      </div>
    </form>
  );
}
