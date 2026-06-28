# i18n Progress Summary

## Original Request

Plan and update the source code to:

1. Add an in-app language selector, with Vietnamese as the default language.
2. Fully replace Chinese UI text with Vietnamese.
3. Add English translations.

## Completed Work

- Added a lightweight i18n helper for the UniApp/Vue frontend, defaulting to `vi` and supporting `en`.
- Added language selection on the login screen and settings screen.
- Moved key login/settings UI text and shared helper text into the i18n dictionary.
- Updated HTTP and upload requests to include `_locale`, so the backend can return localized messages.
- Added backend dictionaries for `vi` and `en`.
- Localized the main backend `msg` responses for login/settings flows while keeping the existing API response format.
- Committed and pushed the source code to `origin/main`.
- Configured Git LFS for binary assets and added `.gitignore` rules for generated files.

## Main Files Updated

- `view-h5/view-h5/common/i18n.js`
- `view-h5/view-h5/common/_mixins.js`
- `view-h5/view-h5/common/_hook.js`
- `view-h5/view-h5/common/_action.js`
- `view-h5/view-h5/common/_data.js`
- `view-h5/view-h5/main.js`
- `view-h5/view-h5/pages/in/login.vue`
- `view-h5/view-h5/pages/set/index.vue`
- Backend `app/common.php`
- Backend `app/im/controller/In.php`
- Backend `app/im/controller/Set.php`
- `.gitattributes`
- `.gitignore`

## Checks Run

- `php -l` on the updated backend files.
- `node --check` on the updated JavaScript files.
- `git lfs fsck`.
- `git status` after pushing: `main` matches `origin/main`.

## Notes

- Files and folders such as `node_modules`, `unpackage`, `.DS_Store`, `.idea`, `__MACOSX`, and `nohup.out` are dependencies, build outputs, system files, or local cache. They are ignored and do not need to be committed.
- Git LFS is now configured for binary files such as images, audio, fonts, archives, documents, and APK files.
- The LFS setup does not rewrite existing Git history. It applies from the Git LFS configuration commit onward.

## Recommended Next Steps

- Continue reviewing the remaining app screens and replace any leftover Chinese text with i18n keys.
- Expand the `vi` and `en` backend dictionaries for API messages outside the login/settings flows.
- Run manual app checks for login, chat list, chat messages, contacts/friends, profile, and settings.
