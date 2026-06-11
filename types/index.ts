export type Locale = "no" | "sv" | "en";

export type TripStatus = "active" | "draft" | "archived";
export type DepartureStatus = "open" | "confirmed" | "full" | "cancelled";
export type BookingStatus =
  | "pending"
  | "deposit_paid"
  | "confirmed"
  | "cancelled";
export type InquiryType = "interest" | "private" | "general";
export type InquiryStatus = "new" | "contacted" | "closed";

export interface Trip {
  id: string;
  slug: string;
  title_no: string;
  title_sv: string | null;
  title_en: string | null;
  tagline_no: string | null;
  tagline_sv: string | null;
  tagline_en: string | null;
  description_no: string | null;
  description_sv: string | null;
  description_en: string | null;
  category: string;
  district: string | null;
  tags: string[] | null;
  includes_no: string[] | null;
  excludes_no: string[] | null;
  min_persons: number;
  max_persons: number;
  base_price_eur: number;
  duration_days: number | null;
  duration_nights: number | null;
  difficulty_level: string | null;
  meeting_point: string | null;
  max_solo_travelers: number | null;
  single_room_supplement_eur: number | null;
  deposit_pct: number | null;
  agent_price_eur: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  is_private: boolean;
  featured: boolean;
  agent_visible: boolean;
  status: TripStatus;
  created_at: string;
  updated_at: string | null;
}

export interface Departure {
  id: string;
  trip_id: string;
  start_date: string;
  end_date: string;
  available_spots: number;
  min_persons: number;
  price_eur: number | null;
  guide_name: string | null;
  notes: string | null;
  status: DepartureStatus;
  confirmed_at: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  departure_id: string;
  guest_name: string;
  email: string;
  phone: string;
  persons: number;
  total_eur: number;
  deposit_eur: number;
  deposit_paid_at: string | null;
  remainder_eur: number;
  remainder_due_date: string | null;
  remainder_paid_at: string | null;
  payment_method: string | null;
  status: BookingStatus;
  pickup_point: string | null;
  allergies: string | null;
  mobility_notes: string | null;
  health_notes: string | null;
  room_type: string | null;
  terms_accepted_at: string | null;
  agent_id: string | null;
  language: Locale;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  departure_id: string;
  name: string;
  email: string;
  phone: string | null;
  persons: number;
  notified_at: string | null;
  created_at: string;
}

export interface Inquiry {
  id: string;
  trip_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  group_size: number | null;
  preferred_dates: string | null;
  message: string | null;
  type: InquiryType;
  status: InquiryStatus;
  language: Locale;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  language: Locale;
  source: string | null;
  confirmed_at: string | null;
  created_at: string;
}

export interface LocalizedTrip {
  trip: Trip;
  title: string;
  tagline: string | null;
  description: string | null;
}

export interface TripWithDepartures {
  trip: Trip;
  departures: Departure[];
}
