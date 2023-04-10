# @jiangweixian1994/zustand-middlewares

## features

Some useful middlewares and utils for zustand

- `local & sync` storage for `webext` develop.
- `logger` for `set` action logger.

## install

```sh
pnpm i @jiangweixian1994/zustand-middlewares zustand webextension-polyfill
```

## usage

### `/devtools`

#### `logger`

> REASON: webext with zustand, unable use devtools and redux-extensions. Use `logger` instead

```tsx
import { logger } from '@jiangweixian1994/zustand-middlewares/devtools'

export const useBearStore = create<BearState>()(
  logger(
    set => ({
      // ...state
      action: () => set(partialState, replace, 'actionname')
    }),
    {
      name: 'store-name',
    },
  ),
)
```

**'actionname'** is required for display friendly message.

**display messgae format:**

```console
action: store-name : actionname
  prev state: <prevstate>
  action:     <action info>
  next state: <nextstate>
```

### `/storage`

#### `local`

Save store data into [`browsers.storage.local`](https://developer.chrome.com/docs/extensions/reference/storage/#property-local) instead of local-storage.

> REASON: `localstorage` is only provide(5MB per domain). `browsers.storage.local` with "unlimitedStorage" permission. Consider using it to store larger amounts of data.

```tsx
import { local } from '@jiangweixian1994/zustand-middlewares/storage'

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