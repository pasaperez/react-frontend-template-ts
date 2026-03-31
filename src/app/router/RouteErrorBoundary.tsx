import { useDocumentMetadata } from '@app/seo/useDocumentMetadata';
import type { ReactElement } from 'react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

interface RouteErrorState {
    code: string;
    message: string;
}

function getRouteErrorState(error: unknown): RouteErrorState {
    if (isRouteErrorResponse(error)) {
        return { code: String(error.status), message: error.statusText };
    }

    if (error instanceof Error) {
        return { code: 'Error', message: error.message };
    }

    return { code: 'Error', message: 'The route failed before it could render.' };
}

export function RouteErrorBoundary(): ReactElement {
    const error: unknown = useRouteError();
    const errorState: RouteErrorState = getRouteErrorState(error);

    useDocumentMetadata({
        description: 'The current route failed before it could render. Review the error message and return to a working page.',
        title: 'Route error | React Frontend Template TS'
    });

    return (
        <section aria-labelledby='route-error-title' className='status-page'>
            <div className='status-page__surface'>
                <p className='status-page__eyebrow'>{errorState.code}</p>
                <h1 id='route-error-title'>Something went wrong</h1>
                <p className='status-page__message' role='alert'>{errorState.message}</p>
                <div className='status-page__actions'>
                    <Link className='button button--secondary' to='/users'>Back to users</Link>
                </div>
            </div>
        </section>
    );
}
