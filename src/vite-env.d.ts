/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Base URL of the captions relay (relay/README.md), if one is deployed. */
  readonly VITE_CAPTIONS_RELAY?: string
}
