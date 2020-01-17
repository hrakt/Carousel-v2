/* global danger, warn */
import includes from 'lodash/includes';

export default async () => {
    const hasPackageChanges = includes(
        danger.git.modified_files,
        'package.json'
    );
    const hasLockfileChanges = includes(
        danger.git.modified_files,
        'package-lock.json'
    );
    if (hasPackageChanges && !hasLockfileChanges) {
        warn(
            'There are package.json changes with no corresponding lockfile changes'
        );
    }
};
