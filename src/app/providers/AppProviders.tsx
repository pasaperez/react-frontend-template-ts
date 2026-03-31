import type { AppDependencies } from '@app/composition/createAppDependencies';
import { createAppRouter } from '@app/router/createAppRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactElement, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';

interface AppProvidersProps {
    dependencies: AppDependencies;
}

function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: { queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false }, mutations: { retry: 0 } }
    });
}

export function AppProviders({ dependencies }: AppProvidersProps): ReactElement {
    const [queryClient] = useState<QueryClient>(createQueryClient);
    const [router] = useState<ReturnType<typeof createAppRouter>>(() => createAppRouter(dependencies));

    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}
