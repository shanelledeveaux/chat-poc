import Link from "next/link";

type LinkProps = { href: string; onClick?: never };
type ButtonProps = { onClick: () => void | Promise<void>; href?: never };
type ComboProps = (LinkProps | ButtonProps) & {
  children: React.ReactNode;
  className?: string;
};

export function PrimaryButton(props: ComboProps) {
  const base =
    "rounded-md bg-indigo-100 px-4 py-3 text-xs font-bold text-gray-900 hover:bg-indigo-200 active:bg-indigo-300";
  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={`${base} ${props.className ?? ""}`}
        prefetch={false}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      onClick={props.onClick}
      className={`${base} ${props.className ?? ""}`}
    >
      {props.children}
    </button>
  );
}
