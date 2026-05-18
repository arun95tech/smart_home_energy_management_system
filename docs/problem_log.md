# Problem Log

This file records errors, issues, and problems found during development, along with how they were resolved.

## Issue History

# 01
- Problem: After creating the backend apps, we faced an error during testing.
- Cause: The recommendation app was registered with the wrong spelling.
- Solution: We checked and corrected the spelling.
- Status: Resolved

# 02
- Problem: The database tables were not available before testing the backend.
- Cause: The migrations had not been applied yet.
- Solution: We ran the migration command, and all database tables were created successfully.
- Status: Resolved

# 03
- Problem: The frontend API paths did not match the backend routes at first.
- Cause: The frontend was calling short API paths, but the backend routes were grouped by app name.
- Solution: We corrected the API service paths so they match the Django backend routes.
- Status: Resolved

# 05
- Problem: The frontend build failed in the normal command run.
- Cause: Vite could not read the config file because of a local permission issue.
- Solution: We ran the build again with the required permission, and the build completed successfully.
- Status: Resolved

