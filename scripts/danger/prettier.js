/* global danger, markdown, fail, warn */
import prettier from 'prettier';
import tablemark from 'tablemark';

import fs from 'fs';
import path from 'path';
let config = {};

const parsers = {
    scss: 'css',
    sass: 'css',
    css: 'css',
    js: 'babel',
    json: 'json',
    md: 'markdown',
    html: 'html',
    htm: 'html',
    yaml: 'yaml',
    yml: 'yaml',
};

export default async () => {
    try {
        fs.readFileSync(
            path.resolve(__dirname, '../../.prettierrc.js'),
            'utf8'
        );
        config = require('../../.prettierrc');
    } catch (e) {
        warn(
            'No ./.prettierrc.js found, using default @madeinhaus/prettier-config'
        );
        config = require('@madeinhaus/prettier-config');
    }

    const filesToLint = danger.git.created_files
        .concat(danger.git.modified_files)
        .filter(f => /\.(js|jsx|json|scss|sass|css)$/i.test(f));

    const options = {
        ...config,
        ignorePath: path.join(__dirname, '../../', '.prettierignore'),
    };

    const output = [];

    filesToLint.forEach(filename => {
        if (prettier.getFileInfo.sync(filename, options).ignored) {
            output.push({ file: `~~${filename}~~`, status: 'Ignored' });
            return;
        }
        const content = fs.readFileSync(
            path.join(__dirname, '../../', filename),
            'utf8'
        );

        const ext = filename.split('.').pop();

        if (
            prettier.check(content, {
                ...options,
                parser: parsers[ext] || undefined,
            })
        ) {
            output.push({ file: filename, status: '✅' });
        } else {
            output.push({ file: filename, status: '❌' });
            fail(`Prettier: ${filename} failed`);
        }
    });

    if (output.length > 0) {
        const table = tablemark(output, {
            columns: ['File', { name: 'Status', align: 'center' }],
        });
        markdown('## Prettier \n' + table);
        markdown(
            `<details><summary><code>Prettier Settings</code></summary></br>`
        );
        markdown('```jsonc');
        markdown(
            prettier.format(JSON.stringify(config), {
                ...options,
                parser: 'json',
            })
        );
        markdown('```');
        markdown('</details>');
    }
};
