# MetroTransit NextTrip

Typescript Metro Transit API wrapper for the Minneapolis / St.Paul Nextrip web service as defined at https://svc.metrotransit.org/nextrip

## Usage

```javascript
import MetroTransitClient, { Provider } from "metrotransit";

const client = new MetroTransitClient();

const providers: Provider[] = await client.getProviders();
```