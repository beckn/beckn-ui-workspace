export const ErrorMessage = ({ fieldError }) => {
  if (!fieldError) {
    return null;
  }

  return (
    <div className="mt-1 ps-2 text-danger small">{fieldError.message}</div>
  );
};
