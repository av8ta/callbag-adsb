# callbag-adsb

👜 callbag source for decoding, parsing, and streaming ads-b packets

Decodes and parses ads-b packets received from a software defined radio such as the repurposed digital tv usb stick known as rtl-sdr.

## Usage

```typescript
import adsbSource from 'callbag-adsb'
import observe from 'callbag-observe'

const messages = adsbSource()

observe(console.log)(messages)
```

## Options

```typescript
const messages = adsbSource(socketOptions?: SocketConnectOpts, reconnectionOptions?: Options)
```

socketOptions: see [`net.Socket SocketConnectOpts`](https://nodejs.org/api/net.html#socketconnectoptions-connectlistener)

Defaults to dump1090 port and host so you may not need to set it.

```
{
  port: 30002,
  host: 'localhost'
}
```

```typescript
interface Options {
  connectionListener?: () => void | undefined   // Default: undefined
  reconnectOnEnd?: boolean,                     // Default: true
  retries?: number                              // Default: -1 always attempt reconnection
}
```

## Config

If you already have dump1090 software running it will connect on localhost:30002. Otherwise, set env vars to change the port and host as required.

```shell
websocket_port=<your port>
websocket_host=<your host>
```

Alternatively, hard code your connection options:

```javascript
const messages = adsbSource({ port: 30002, host: 'localhost' }, { retries: 90 })
```

See examples directory for fuller examples.
