import axios from "axios";

const _axios = axios.create({
    baseURL: "http://svc.metrotransit.org/nextrip",
    headers: {
        "Content-Type": "application/json",
        Accepts: "application/json"
    }
});

/** Returns a list of area Transit providers. Providers are identified in the list of Routes allowing routes to be selected for a single provider. */
export const getProviders = async (): Promise<Provider[]> => {
    try {
        const { data } = await _axios.get<Provider[]>("/Providers");
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data as string);
        }
        throw err;
    }
};

/** Returns a list of Transit routes that are in service on the current day. */
export const getRoutes = async (): Promise<Route[]> => {
    try {
        const { data } = await _axios.get<Route[]>("/Routes");
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data as string);
        }
        throw err;
    }
};

/** Returns the two directions that are valid for a given route. Either North/South or East/West. The result includes text/value pair with the direction name and an ID. Directions are identified with an ID value. 1 = South, 2 = East, 3 = West, 4 = North. */
export const getRouteDirections = async (route: string): Promise<Direction[]> => {
    try {
        const { data } = await _axios.get<Direction[]>(`/Directions/${route}`);
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data as string);
        }
        throw err;
    }
};

/** Returns a list of Timepoint stops for the given Route/Direction. The result includes text/value pairs with the stop description and a 4 character stop (or node) identifier. */
export const getRouteStops = async (route: string, direction: DirectionValue): Promise<Stop[]> => {
    try {
        const { data } = await _axios.get<Direction[]>(`/Stops/${route}/${direction}`);
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data as string);
        }
        throw err;
    }
};

/** This operation is used to return a list of departures scheduled for any given bus stop. A StopID is an integer value identifying any one of the many thousands of bus stops in the metro. Stop information can be derived from the GTFS schedule data updated weekly for public use. https://gisdata.mn.gov/dataset/us-mn-state-metc-trans-transit-schedule-google-fd */
export const getStopDepartures = async (stopID: string): Promise<Departure[]> => {
    try {
        const { data } = await _axios.get<Departure[]>(`/${stopID}}`);
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data as string);
        }
        throw err;
    }
};

/** Returns the scheduled departures for a selected route, direction and timepoint stop */
export const getRouteTimepointDepartures = async (route: string, direction: DirectionValue, stopID: string): Promise<Departure[]> => {
    try {
        const { data } = await _axios.get<Departure[]>(`/${route}/${direction}/${stopID}}`);
        return data;
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data as string);
        }
        throw err;
    }
};

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

/** North and East are 0, South and West are 1. API documentation erroneously declares: `"Directions are identified with an ID value. 1 = South, 2 = East, 3 = West, 4 = North."` (https://svc.metrotransit.org/nextrip) */
export enum DirectionValue {
    South = "1",
    East = "0",
    West = "1",
    North = "0"
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
    /** displays time format for scheduled time and countdown format for real-time departures. (Actual=true). If Actual is true, returns a format similar to `15 Minutes`. If Actual is false, returns a time string similar to `11:32`.  */
    DepartureText: string;
    /** datetime value of the departure time. In .NET serialized format similar to `"/Date(1634094780000-0500)/"` */
    DepartureTime: string;
    /** describes the trip destination */
    Description: string;
    /** indicates the stop or gate identifier where applicable */
    Gate: string;
    /** the current route for this departure */
    Route: string;
    /** the current trip direction */
    RouteDirection: "EB" | "WB" | "NB" | "SB";
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
    BlockNumber: number;
    /** the direction ID of the current trip direction */
    Direction: DirectionValue;
    /** the time the location was last reported by the vehicle. In .NET serialized format similar to `"/Date(1634094780000-0500)/"` */
    LocationTime: string;
    /** the current route for the vehicle */
    Route: string;
    /** the route branch letter where applicable */
    Terminal: string;
    /** last reported latitude */
    VehicleLatitude: number;
    /** last reported longitude */
    VehicleLongitude: number;
    /** Angle of direction 0-360 */
    Bearing: number;
    /** this value is currently not available and always returns 0. (for future use) */
    Odometer: number;
    /** last recorded speed */
    Speed: number;
}
