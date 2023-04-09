# @jiangweixian/zustand-middlewares

## features

Some useful middlewares and utils for zustand

- `local & sync` storage for `webext` develope

## install

```sh
pnpm i @jiangweixian/zustand-middlewares zustand webextension-polyfill
```

## usage

### `/storage`

### `local`

Save store data into [`browsers.storage.local`](https://developer.chrome.com/docs/extensions/reference/storage/#property-local) instead of local-storage.

> REASON: `localstorage` is only provide(5MB per domain). `browsers.storage.local` with "unlimitedStorage" permission. Consider using it to store larger amounts of data.

```tsx
import { local } from '@jiangweixian/zustand-middlewares/storage'

export const useBearStore = create<BearState>()(
  persist(
    set => ({
      // ...state
    }),
    {
      name: 'store-name',
      storage: createJSONStorage(() => local),
    },
  ),
)
```

**other similar storage type**

- `sync` - `browsers.storage.sync`, sync data between devices.