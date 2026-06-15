export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onConfirm}>Confirm</button>
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
