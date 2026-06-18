import React from 'react';

type ButtonComponentProps = {
  onButtonClick: () => void;
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({ onButtonClick }) => {
  return <button onClick={onButtonClick}>Click me</button>;
};

export default ButtonComponent;