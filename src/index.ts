import axios from "axios";

const _axios = axios.create({
    baseURL: "http://svc.metrotransit.org/nextrip",
    headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
    }
});

/**
The NexTrip API is a real-time transit departure data web service for third-party application developers using Metro Transit information.

NexTrip departure information updates every 30 seconds. Help conserve our bandwidth and server resources by writing your applications responsibly. Third party applications should not update departure information more frequently than every 30 seconds. Applications making excessive calls and updating more frequently than 30 seconds will be subject to restriction.

There are seven requests with four different response schema.
See also http://svc.metrotransit.org/nextrip/help

All type information is generated from https://svc.metrotransit.org/nextrip
 */
class MetroTransitClient {
    /** Returns a list of area Transit providers. Providers are identified in the list of Routes allowing routes to be selected for a single provider. */
    async providers(): Promise<Provider[]> {
        try {
            const { data } = await _axios.get<Provider[]>("/Providers");
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data);
            }
            throw err;
        }
    }

    /** Returns a list of Transit routes that are in service on the current day. */
    async routes(): Promise<Route[]> {
        try {
            const { data } = await _axios.get<Route[]>("/Routes");
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data);
            }
            throw err;
        }
    }

    /** Returns the two directions that are valid for a given route. Either North/South or East/West. The result includes text/value pair with the direction name and an ID. Directions are identified with an ID value. 1 = South, 2 = East, 3 = West, 4 = North. */
    async directions(route: string): Promise<Direction[]> {
        try {
            const { data } = await _axios.get<Direction[]>(`/Directions/${route}`);
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data);
            }
            throw err;
        }
    }

    /** Returns a list of Timepoint stops for the given Route/Direction. The result includes text/value pairs with the stop description and a 4 character stop (or node) identifier. */
    async stops(route: string, direction: DirectionValue): Promise<Stop[]> {
        try {
            const { data } = await _axios.get<Direction[]>(`/Stops/${route}/${direction}`);
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data);
            }
            throw err;
        }
    }

    /** This operation is used to return a list of departures scheduled for any given bus stop. A StopID is an integer value identifying any one of the many thousands of bus stops in the metro. Stop information can be derived from the GTFS schedule data updated weekly for public use. https://gisdata.mn.gov/dataset/us-mn-state-metc-trans-transit-schedule-google-fd */
    async departures(stopID: string): Promise<Departure[]> {
        try {
            const { data } = await _axios.get<Departure[]>(`/${stopID}}`);
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data);
            }
            throw err;
        }
    }

    /** Returns the scheduled departures for a selected route, direction and timepoint stop */
    async timepointDepartures(route: string, direction: DirectionValue, stopID: string): Promise<Departure[]> {
        try {
            const { data } = await _axios.get<Departure[]>(`/${route}/${direction}/${stopID}}`);
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data);
            }
            throw err;
        }
    }

    /** This operation returns a list of vehicles currently in service that have recently (within 5 minutes) reported their locations. A route paramter is used to return results for the given route. Use "0" for the route parameter to return a list of all vehicles in service. */
    async vehicleLocations(route: string): Promise<VehicleLocation[]> {
        try {
            const { data } = await _axios.get<VehicleLocation[]>(`/VehicleLocations/${route}`);
            return data;
        } catch (err) {
            if (axios.isAxiosError(err)) {
                throw new Error(err.response?.data);
            }
            throw err;
        }
    }
}

export default MetroTransitClient;

export interface TextValuePair {
    Text: string;
    Value: string;
}

export type Provider = TextValuePair;

export interface Route {
    /** description of the route */
    Description: string;
    /** identifier that corresponds to elements returned by the GetProviders operation */
    ProviderID: string;
    /** route number or label */
    Route: string;
}

export enum DirectionValue {
    South = "1",
    East = "2",
    West = "3",
    North = "4"
}

export type Direction = TextValuePair;

export interface Stop {
    Text: string;
    Value: string;
}

export interface Departure {
    /** bool indicates the departure time is based on current information from the vehicle */
    Actual: boolean;
    /** indicates the work for a vehicle */
    BlockNumber: string;
    /** displays time format for scheduled time and countdown format for real-time departures. (Actual=true) */
    DepartureText: string;
    /** datetime value of the departure time */
    DepartureTime: string;
    /** describes the trip destination */
    Description: string;
    /** indicates the stop or gate identifier where applicable */
    Gate: string;
    /** the current route for this departure */
    Route: string;
    /** the current trip direction */
    RouteDirection: DirectionValue;
    /** the route branch letter where applicable */
    Terminal: string;
    /** this value is currently not available and always returns 0. (maybe someday) */
    VehicleHeading: string;
    /** last reported latitude. only included with real-time departures. (Actual=true) */
    VehicleLatitude: string;
    /** last reported longitude. only included with real-time departures. (Actual=true) */
    VehicleLongitude: string;
}

export interface VehicleLocation {
    /**  indicates the work for a vehicle */
    BlockNumber: string;
    /** the direction ID of the current trip direction */
    Direction: DirectionValue;
    /** the time the location was last reported by the vehicle */
    LocationTime: string;
    /** the current route for the vehicle */
    Route: string;
    /** the route branch letter where applicable */
    Terminal: string;
    /** last reported latitude */
    VehicleLatitude: string;
    /** last reported longitude */
    VehicleLongitude: string;
    /** this value is currently not available and always returns 0. (for future use) */
    Bearing: string;
    /** this value is currently not available and always returns 0. (for future use) */
    Odometer: string;
    /** this value is currently not available and always returns 0. (for future use) */
    Speed: string;
}
