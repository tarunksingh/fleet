interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

export default function Toast({ message, type = 'success' }: ToastProps) {
  return <div className={`toast toast-${type}`}>{message}</div>;
}
