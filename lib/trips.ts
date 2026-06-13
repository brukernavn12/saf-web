import { normalizeEurPrice } from "@/lib/pricing";
import { createSupabaseClient } from "@/lib/supabase";
import {
  isUpcomingDeparture,
  normalizeIsoDate,
  normalizeTripItinerary,
} from "@/lib/utils";
import type { Departure, Trip } from "@/types";

function mapTrip(row: Record<string, unknown>): Trip {
  const trip = row as unknown as Trip;
  return {
    ...trip,
    is_private: trip.is_private ?? false,
    featured: trip.featured ?? false,
    base_price_eur: normalizeEurPrice(Number(row.base_price_eur)),
    min_persons_per_booking: Number(
      row.min_persons_per_booking ?? row.min_persons ?? 1
    ),
    min_persons_to_confirm: Number(
      row.min_persons_to_confirm ?? row.min_persons ?? 2
    ),
    min_persons: Number(row.min_persons ?? row.min_persons_to_confirm ?? 2),
    price_nok: row.price_nok ? Number(row.price_nok) : null,
    price_info:
      typeof row.price_info === "string" ? row.price_info : null,
    price_info_en:
      typeof row.price_info_en === "string" ? row.price_info_en : null,
    itinerary: normalizeTripItinerary(row.itinerary),
    itinerary_en: normalizeTripItinerary(row.itinerary_en),
    program_no: typeof row.program_no === "string" ? row.program_no : null,
    program_en: typeof row.program_en === "string" ? row.program_en : null,
    group_size_no:
      typeof row.group_size_no === "string" ? row.group_size_no : null,
    group_size_en:
      typeof row.group_size_en === "string" ? row.group_size_en : null,
    interest_only: Boolean(row.interest_only),
    single_room_supplement_eur: row.single_room_supplement_eur
      ? normalizeEurPrice(Number(row.single_room_supplement_eur))
      : null,
    deposit_pct: row.deposit_pct ? Number(row.deposit_pct) : null,
    agent_price_eur: row.agent_price_eur
      ? normalizeEurPrice(Number(row.agent_price_eur))
      : null,
  };
}

function mapDeparture(row: Record<string, unknown>): Departure {
  const departure = row as unknown as Departure;
  return {
    ...departure,
    start_date: normalizeIsoDate(row.start_date) ?? String(row.start_date),
    end_date: normalizeIsoDate(row.end_date) ?? String(row.end_date),
    price_eur: row.price_eur
      ? normalizeEurPrice(Number(row.price_eur))
      : null,
  };
}

function sortTrips(trips: Trip[]): Trip[] {
  return [...trips].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return (
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  });
}

export async function getActiveTrips(): Promise<Trip[]> {
  return getActiveTripsByVisibility(false);
}

export async function getPrivateTrips(): Promise<Trip[]> {
  return getActiveTripsByVisibility(true);
}

async function getActiveTripsByVisibility(isPrivate: boolean): Promise<Trip[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  let query = supabase.from("trips").select("*").eq("status", "active");

  query = isPrivate
    ? query.eq("is_private", true)
    : query.or("is_private.is.null,is_private.eq.false");

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch trips:", error.message, error.details);
    return [];
  }

  return sortTrips((data ?? []).map(mapTrip));
}

function sortTripsByDeparture(
  items: { trip: Trip; departures: Departure[] }[]
): { trip: Trip; departures: Departure[] }[] {
  return [...items].sort((a, b) => {
    const aStart = a.departures[0]?.start_date;
    const bStart = b.departures[0]?.start_date;
    const aHasDate = Boolean(aStart);
    const bHasDate = Boolean(bStart);

    if (aHasDate !== bHasDate) {
      return aHasDate ? 1 : -1;
    }

    if (aStart && bStart && aStart !== bStart) {
      return aStart.localeCompare(bStart);
    }

    return (
      new Date(a.trip.created_at).getTime() -
      new Date(b.trip.created_at).getTime()
    );
  });
}

async function attachDeparturesToTrips(
  trips: Trip[]
): Promise<{ trip: Trip; departures: Departure[] }[]> {
  if (trips.length === 0) {
    return [];
  }

  const supabase = createSupabaseClient();
  if (!supabase) {
    return trips.map((trip) => ({ trip, departures: [] }));
  }

  const tripIds = trips.map((trip) => trip.id);
  const { data, error } = await supabase
    .from("departures")
    .select("*")
    .in("trip_id", tripIds)
    .in("status", ["open", "confirmed"])
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Failed to fetch departures:", error.message, error.details);
    return sortTripsByDeparture(
      trips.map((trip) => ({ trip, departures: [] }))
    );
  }

  const departuresByTrip = new Map<string, Departure[]>();
  for (const row of data ?? []) {
    const departure = mapDeparture(row);
    const list = departuresByTrip.get(departure.trip_id) ?? [];
    list.push(departure);
    departuresByTrip.set(departure.trip_id, list);
  }

  return sortTripsByDeparture(
    trips.flatMap((trip) => {
      const allDepartures = departuresByTrip.get(trip.id) ?? [];
      const upcomingDepartures = allDepartures.filter(isUpcomingDeparture);

      if (trip.interest_only || allDepartures.length === 0) {
        return [{ trip, departures: upcomingDepartures }];
      }

      if (upcomingDepartures.length === 0) {
        return [];
      }

      return [{ trip, departures: upcomingDepartures }];
    })
  );
}

export async function getActiveTripsWithDepartures(): Promise<
  { trip: Trip; departures: Departure[] }[]
> {
  return attachDeparturesToTrips(await getActiveTrips());
}

export async function getPrivateTripsWithDepartures(): Promise<
  { trip: Trip; departures: Departure[] }[]
> {
  return attachDeparturesToTrips(await getPrivateTrips());
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  const supabase = createSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch trip:", error.message, error.details);
    return null;
  }

  if (!data) return null;

  return mapTrip(data);
}

export async function getDeparturesForTrip(tripId: string): Promise<Departure[]> {
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("departures")
    .select("*")
    .eq("trip_id", tripId)
    .in("status", ["open", "confirmed"])
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Failed to fetch departures:", error.message, error.details);
    return [];
  }

  return (data ?? []).map(mapDeparture).filter(isUpcomingDeparture);
}

export async function getTripWithDepartures(
  slug: string
): Promise<{ trip: Trip; departures: Departure[] } | null> {
  const trip = await getTripBySlug(slug);

  if (!trip) {
    return null;
  }

  const departures = await getDeparturesForTrip(trip.id);

  return { trip, departures };
}
