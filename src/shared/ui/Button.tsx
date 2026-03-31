import type { ButtonHTMLAttributes, ReactElement } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', type = 'button', ...props }: ButtonProps): ReactElement {
    return <button className={`button ${className}`.trim()} type={type} {...props} />;
}
