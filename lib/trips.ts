import { createSupabaseClient } from "@/lib/supabase";
import type { Departure, Trip } from "@/types";

function mapTrip(row: Record<string, unknown>): Trip {
  const trip = row as unknown as Trip;
  return {
    ...trip,
    is_private: trip.is_private ?? false,
    featured: trip.featured ?? false,
    base_price_eur: Number(row.base_price_eur),
    price_nok: row.price_nok ? Number(row.price_nok) : null,
    price_info:
      typeof row.price_info === "string" ? row.price_info : null,
    interest_only: Boolean(row.interest_only),
    single_room_supplement_eur: row.single_room_supplement_eur
      ? Number(row.single_room_supplement_eur)
      : null,
    deposit_pct: row.deposit_pct ? Number(row.deposit_pct) : null,
    agent_price_eur: row.agent_price_eur
      ? Number(row.agent_price_eur)
      : null,
  };
}

function mapDeparture(row: Record<string, unknown>): Departure {
  const departure = row as unknown as Departure;
  return {
    ...departure,
    price_eur: row.price_eur ? Number(row.price_eur) : null,
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
  const supabase = createSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "active")
    .or("is_private.is.null,is_private.eq.false");

  if (error) {
    console.error("Failed to fetch trips:", error.message, error.details);
    return [];
  }

  return sortTrips((data ?? []).map(mapTrip));
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  const supabase = createSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .or("is_private.is.null,is_private.eq.false")
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

  return (data ?? []).map(mapDeparture);
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
