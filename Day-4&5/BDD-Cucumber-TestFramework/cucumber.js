const defaultConfig = {
    requireModule: [
        'ts-node/register',
        'tsconfig-paths/register'
    ],
    require: [
        'src/support/**/*.ts',
        'src/hooks/**/*.ts',
        'src/features/stepDefinitions/**/*.ts'
    ],
    format: [
        'progress',
        'json:src/reports/cucumber-report.json',
        'html:src/reports/cucumber-report.html'
    ],
    formatOptions: {
        snippetInterface: 'async-await'
    },
    publish: false,
    retry: process.env.CI ? 1 : 0,
    parallel: process.env.CI ? 1 : 0,
    strict: true
};

module.exports = {
    default: defaultConfig
};