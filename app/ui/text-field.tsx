import { css, type Handle, type Props } from "remix/ui";

import { colors } from "./colors.ts";

export type TextFieldProps = Props<"input"> & {
  label: string;
  error?: string;
};

const fieldStyle = css({
  display: "flex",
  flexDirection: "column",
});

const inputStyle = css({
  font: "inherit",
  color: "inherit",
  background: colors.body.secondary.background,
  border: "none",
  borderBottom: `1px solid ${colors.border.strong}`,
  borderRadius: 0,
  padding: 0,
  margin: 0,
  width: "25ch",
  "&:focus": { outline: "none" },
  "&:focus-visible": { outline: "none" },
});

const errorSlotStyle = css({
  minHeight: "1lh",
});

export function TextField(handle: Handle<TextFieldProps>) {
  let inputId = `${handle.id}-input`;
  let errorId = `${handle.id}-error`;

  return () => {
    let { label, error, mix, ...inputProps } = handle.props;
    return (
      <div mix={fieldStyle}>
        <label htmlFor={inputId}>{label}</label>
        <input
          {...inputProps}
          id={inputId}
          aria-invalid={error == null ? undefined : "true"}
          aria-describedby={error == null ? undefined : errorId}
          mix={[inputStyle, mix]}
        />
        <div mix={errorSlotStyle}>
          {error == null ? null : (
            <p id={errorId} role="alert" mix={css({ margin: 0 })}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  };
}
