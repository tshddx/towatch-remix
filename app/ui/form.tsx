import { css, type Props } from "remix/ui";

export type FormProps = Props<"form">;

const formStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "1lh",
});

export function Form() {
  return ({ mix, children, ...props }: FormProps) => (
    <form {...props} mix={[formStyle, mix]}>
      {children}
    </form>
  );
}
