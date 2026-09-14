# Local execution evidence scripts

These scripts run authored HTML and compiled preview code in headless Chromium without URL navigation. They do not alter browser or enterprise policies. Set CHROMIUM_PATH to the local Chromium executable. Run from any working directory after installing requirements.txt. They use the bundled React 19.1.1 inspection runtime, not the npm React 19.2.7 production build.

Outputs replace the corresponding reports/*.json and screenshots. A screenshot capture is not automatic visual approval. Optical testing compares a deliberately fixed grid and opaque foreground patch; it does not certify arbitrary backgrounds. Browser downloads are intercepted in the quality suite to inspect Blob generation, and the CSP case is an equivalent inline fixture, not the HTTP deployment test.
