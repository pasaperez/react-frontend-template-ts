import { App } from '@app/App';
import { createAppDependencies } from '@app/composition/createAppDependencies';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@app/styles/index.css';

const container: HTMLElement | null = document.getElementById('root');

if (container === null) {
    throw new Error('Root element "#root" was not found.');
}

createRoot(container).render(
    <StrictMode>
        <App dependencies={createAppDependencies()} />
    </StrictMode>
);
