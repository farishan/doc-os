import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    input: 'src/main.js',
    plugins: [sourcemaps()],
    output: {
        sourcemap: true,
        file: 'bundle.js',
    }
};