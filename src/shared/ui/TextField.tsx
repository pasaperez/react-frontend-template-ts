import type { InputHTMLAttributes, ReactElement } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
    error?: string | undefined;
    id: string;
    label: string;
}

export function TextField({ error, id, label, ...props }: TextFieldProps): ReactElement {
    const errorId: string = `${id}-error`;

    return (
        <div className='field'>
            <label htmlFor={id}>{label}</label>
            <input aria-describedby={errorId} aria-invalid={error !== undefined} id={id} {...props} />
            {error !== undefined ? <span className='field__error' id={errorId}>{error}</span> : null}
        </div>
    );
}
