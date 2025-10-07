/*
 AI-generated code: 15% Formatting help with GPT
 Human code: 85% functions/classes: DeleteAll props + behavior
*/

type Props = {
  onConfirm?: () => void | Promise<void>; // optional: parent handles the delete
  disabled?: boolean;
  label?: string;
};

const DeleteAll: React.FC<Props> = ({ onConfirm, disabled, label }) => {
  const handleClick = async () => {
    if (disabled) return;
    const ok = window.confirm(
      'Are you sure you want to delete all jobs? This action cannot be undone.'
    );
    if (!ok) return;

    // if parent provided a handler, use it; otherwise keep old behavior
    if (onConfirm) {
      await onConfirm();
    } else {
      alert('All jobs deleted.');
    }
  };

  return (
    <button
      className="btn btn-danger"
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
    >
      {label ?? 'Delete All'}
    </button>
  );
};

export default DeleteAll;
