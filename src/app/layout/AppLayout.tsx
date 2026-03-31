import { ThemeSelector } from '@app/theme/ThemeSelector';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const projectName = 'React Frontend Template TS';
const sidebarStorageKey = 'react-frontend-template-ts.sidebar';

const navigationItems = [{ id: 'users', label: 'Users', shortLabel: 'U', to: '/users' }] as const;

function readStoredSidebarState(storage: Storage): boolean {
    return storage.getItem(sidebarStorageKey) === 'collapsed';
}

function persistSidebarState(storage: Storage, isCollapsed: boolean): void {
    storage.setItem(sidebarStorageKey, isCollapsed ? 'collapsed' : 'expanded');
}

interface NavigationToggleButtonProps {
    ariaExpanded: boolean;
    ariaLabel: string;
    className: string;
    onClick: () => void;
}

function NavigationToggleButton({ ariaExpanded, ariaLabel, className, onClick }: NavigationToggleButtonProps): ReactElement {
    return (
        <button
            aria-controls='app-sidebar'
            aria-expanded={ariaExpanded}
            aria-label={ariaLabel}
            className={className}
            onClick={onClick}
            type='button'
        >
            <span aria-hidden='true' className='app-header__toggle-icon'>
                <span className='app-header__toggle-bar' />
                <span className='app-header__toggle-bar' />
                <span className='app-header__toggle-bar' />
            </span>
        </button>
    );
}

export function AppLayout(): ReactElement {
    const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => readStoredSidebarState(window.localStorage));

    function handleSidebarToggle(): void {
        setIsSidebarCollapsed((currentValue: boolean) => {
            const nextValue: boolean = !currentValue;
            persistSidebarState(window.localStorage, nextValue);

            return nextValue;
        });
    }

    return (
        <div
            className={`app-frame${isSidebarCollapsed ? ' app-frame--sidebar-collapsed' : ''}${
                isMobileNavigationOpen ? ' app-frame--mobile-nav-open' : ''
            }`}
        >
            <a className='skip-link' href='#main-content'>Skip to main content</a>
            {isMobileNavigationOpen
                ? (
                    <button
                        aria-label='Close navigation'
                        className='app-backdrop'
                        onClick={() => setIsMobileNavigationOpen(false)}
                        type='button'
                    />
                )
                : null}
            <header className='app-header'>
                <div className='app-header__brand-group'>
                    <NavigationToggleButton
                        ariaExpanded={!isSidebarCollapsed}
                        ariaLabel={isSidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
                        className='app-header__toggle app-header__toggle--desktop'
                        onClick={handleSidebarToggle}
                    />
                    <NavigationToggleButton
                        ariaExpanded={isMobileNavigationOpen}
                        ariaLabel={isMobileNavigationOpen ? 'Close menu' : 'Open menu'}
                        className='app-header__toggle app-header__toggle--mobile'
                        onClick={() => setIsMobileNavigationOpen((currentValue: boolean) => !currentValue)}
                    />
                    <div className='app-brand'>
                        <Link className='app-brand__title' to='/users'>{projectName}</Link>
                        <span className='app-brand__subtitle'>Scalable React foundation</span>
                    </div>
                </div>
                <div className='app-header__actions'>
                    <ThemeSelector />
                </div>
            </header>
            <div className='app-body'>
                <aside aria-label='Primary navigation' className='app-sidebar' id='app-sidebar'>
                    <div className='app-sidebar__inner'>
                        <div className='app-sidebar__intro'>
                            <span className='app-sidebar__eyebrow'>Navigation</span>
                            <p className='app-sidebar__description'>Core routes for the frontend template.</p>
                        </div>
                        <nav aria-label='Main navigation' className='app-nav'>
                            {navigationItems.map((item) => (
                                <NavLink
                                    className={({ isActive }: { isActive: boolean; }) =>
                                        `app-nav__link${isActive ? ' app-nav__link--active' : ''}`}
                                    key={item.id}
                                    onClick={() => setIsMobileNavigationOpen(false)}
                                    to={item.to}
                                >
                                    <span aria-hidden='true' className='app-nav__icon'>{item.shortLabel}</span>
                                    <span className='app-nav__label'>{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </aside>
                <main className='app-main' id='main-content'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
