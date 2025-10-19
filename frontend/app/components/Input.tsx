import "./Input.css";
import React from "react";

interface RouteNameInputProps {
  routeName: string;
  setRouteName: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  dataTitle?: string;
}


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}


const Input: React.FC<InputProps> = ({ value, onChange, placeholder, type = "text", dataTitle }) => {
  return (
    <>
      <input className="c-checkbox" type="checkbox" id="checkbox" />
      <div className="c-formContainer">
        <div className="c-form">
          <input
            className="c-form__input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            required
          />
          <label className="c-form__buttonLabel" htmlFor="checkbox">
            <button className="c-form__button" type="button">
              Send
            </button>
          </label>
          <label className="c-form__toggle" htmlFor="checkbox" data-title={dataTitle}></label>
        </div>
      </div>
    </>
  );
};

export default Input;