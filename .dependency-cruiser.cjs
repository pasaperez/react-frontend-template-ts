/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
    forbidden: [{
        name: 'no-cross-feature-imports',
        comment: 'Keep features cohesive and avoid direct imports between different features.',
        severity: 'error',
        from: { path: '^src/features/([^/]+)/' },
        to: { path: '^src/features/[^/]+/', pathNot: '^src/features/$1/' }
    }, {
        name: 'domain-stays-pure',
        comment: 'Feature domain cannot depend on app, UI, or infrastructure code.',
        severity: 'error',
        from: { path: '^src/features/[^/]+/domain/' },
        to: { path: '^src/(app/|features/[^/]+/(ui|infrastructure)/)' }
    }, {
        name: 'application-no-concrete-adapters',
        comment: 'Application code depends on domain ports and shared utilities, never on UI or infrastructure.',
        severity: 'error',
        from: { path: '^src/features/[^/]+/application/' },
        to: { path: '^src/(app/|features/[^/]+/(ui|infrastructure)/)' }
    }, {
        name: 'shared-stays-generic',
        comment: 'Shared code must not depend on app or feature-specific modules.',
        severity: 'error',
        from: { path: '^src/shared/' },
        to: { path: '^src/(app/|features/)' }
    }],
    options: { tsConfig: { fileName: 'tsconfig.json' }, exclude: { path: ['node_modules', 'dist', 'coverage'] } }
};
