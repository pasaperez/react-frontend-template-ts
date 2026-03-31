import { useDocumentMetadata } from '@app/seo/useDocumentMetadata';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage(): ReactElement {
    useDocumentMetadata({
        description: 'The requested route does not exist in this frontend template.',
        title: 'Page not found | React Frontend Template TS'
    });

    return (
        <section aria-labelledby='not-found-title' className='status-page'>
            <div className='status-page__surface'>
                <p className='status-page__eyebrow'>404</p>
                <h1 id='not-found-title'>Page not found</h1>
                <p className='status-page__message'>The page you requested does not exist or is no longer available.</p>
                <div className='status-page__actions'>
                    <Link className='button' to='/'>Go to home</Link>
                </div>
            </div>
        </section>
    );
}
