export const CustomSwitch = ({ isOn, handleToggle }) => {
  return (
    <>
      <label className="switch" htmlFor={`react-switch-new`}>
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleToggle}
          id={`react-switch-new`}
        />
        <span className="slider round" />
        <h3 className="textav">{isOn ? "Available" : "Offline"}</h3>
      </label>
    </>
  );
};
