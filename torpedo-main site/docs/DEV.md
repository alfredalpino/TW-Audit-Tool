# Development notes

## Browser extension errors (localhost)

If you see errors like:

- **`Cannot redefine property: ethereum`**
- **`Unknown url scheme 'chrome-extension'`**

they come from **browser extensions** (e.g. crypto wallets like MetaMask) that inject scripts into every page. Next.js dev overlay and source maps can then hit `chrome-extension://` URLs and fail.

**Workaround:** Use one of these when developing:

1. **Incognito/private window** (extensions usually disabled)
2. **Disable the wallet (or other injecting) extension** for `localhost`
3. **Use a separate browser profile** without crypto extensions

These are not bugs in the Torpedo app. The app does not use `window.ethereum` or any extension APIs.
