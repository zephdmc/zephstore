import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
            babel: {
                plugins: [
                    ['@babel/plugin-transform-react-jsx', {
                        runtime: 'automatic',
                        importSource: 'react'
                    }]
                ]
            }
        })
    ],

    // Base configuration
    publicDir: 'public',
    envPrefix: 'VITE_',

    // Build optimization
    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
        treeShaking: true,
        minify: true
    },

    css: {
        postcss: {
            plugins: [tailwindcss(), autoprefixer()]
        },
        modules: {
            localsConvention: 'camelCaseOnly'
        }
    },

    resolve: {
        dedupe: ['react', 'react-dom'], // Ensure single version
        alias: {
            '@': path.resolve(__dirname, './src'),
            '~': path.resolve(__dirname, './public')
        },
        extensions: ['.js', '.jsx', '.json', '.mjs']
    },

    server: {
        port: 3000,
        strictPort: true,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ''),
                secure: false
            }
        },
        watch: {
            usePolling: true,
            interval: 100
        }
    },

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: process.env.NODE_ENV !== 'production',
        minify: 'esbuild', // Change from 'terser' to 'esbuild'
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Force React and its dependencies into a single chunk
                        if (
                            id.includes('react') ||
                            id.includes('react-dom') ||
                            id.includes('scheduler') ||
                            id.includes('@babel/runtime')
                        ) {
                            return 'vendor-react';
                        }
                        return 'vendor-other';
                    }
                }
            }
        },
        terserOptions: {
            compress: {
                drop_console: process.env.NODE_ENV === 'production'
            }
        }
    },

    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/messaging'
        ]
    }
});