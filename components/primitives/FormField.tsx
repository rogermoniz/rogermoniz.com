import type { ReactNode, SelectHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/components/primitives/icons";

const CONTROL =
  "w-full rounded-lg border border-edge bg-surface px-[1.2rem] py-4 font-body text-base text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted placeholder:opacity-60 focus:border-accent focus:shadow-[0_0_0_4px_rgb(216_171_82_/_0.1)]";

export function Field({
  label,
  htmlFor,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative mb-6 flex w-full flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="font-body text-[0.9rem] font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={CONTROL} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${CONTROL} min-h-40 resize-y`} />;
}

export function Select({
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <>
      <select {...props} className={`${CONTROL} cursor-pointer appearance-none`}>
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="pointer-events-none absolute right-[1.2rem] bottom-[1.1rem] size-5 stroke-muted"
      />
    </>
  );
}

export function FormRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">{children}</div>;
}
