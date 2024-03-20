import { useField } from "formik";
import { InputText } from "primereact/inputtext"
import React from "react";

export default function CustomInputText({ label, ...props }) {
  const [field, meta] = useField(props);

  return(
    <div className="mb-3">
      <label htmlFor={props.id || props.name} className="block text-900 font-medium mb-2">{label}</label>
      <InputText {...field} {...props} className={`w-full shadow-1 ${meta.touched && meta.error ? 'p-invalid' : ''}`} />
      <div style={{ minHeight: '20px' }}>
        {meta.touched && meta.error ? (
          <small className="p-error">{meta.error}</small>
        ) : null}
      </div>
    </div>
  );
}