# MetroTransit NextTrip

Typescript Metro Transit API wrapper for the Minneapolis / St.Paul Nextrip web service as defined at https://svc.metrotransit.org/nextrip

From the Metro Transit Site:

> The NexTrip API is a real-time transit departure data web service for third-party application developers using Metro Transit information. NexTrip departure information updates every 30 seconds. 
>
> Help conserve our bandwidth and server resources by writing your applications responsibly. Third party applications should not update departure information more frequently than every 30 seconds. Applications making excessive calls and updating more frequently than 30 seconds will be subject to restriction. 
>
> See also http://svc.metrotransit.org/nextrip/help


## Usage

```javascript
import { getProviders, Provider } from "metrotransit";

const providers: Provider[] = await getProviders();
```