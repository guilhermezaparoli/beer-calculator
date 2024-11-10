import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    color: string;
    text: string;
}

export function Button({text, color, ...rest}: ButtonProps) {
    return <button className={`flex items-center py-3 px-14 rounded-lg text-white font-bold ${color} disabled:opacity-50`} {...rest}>{text}</button>
}