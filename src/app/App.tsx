import type { AppDependencies } from '@app/composition/createAppDependencies';
import { AppProviders } from '@app/providers/AppProviders';
import type { ReactElement } from 'react';

interface AppProps {
    dependencies: AppDependencies;
}

export function App({ dependencies }: AppProps): ReactElement {
    return <AppProviders dependencies={dependencies} />;
}
