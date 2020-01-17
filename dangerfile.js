// dangerfile.js
import { schedule } from 'danger';
import dependencies from '@seadub/danger-plugin-dependencies';
import prettier from './scripts/danger/prettier';
import eslint from './scripts/danger/eslint';

schedule(prettier());
eslint();
schedule(dependencies({ type: 'npm' }));
