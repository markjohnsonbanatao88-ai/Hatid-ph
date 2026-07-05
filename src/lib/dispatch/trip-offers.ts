export type SafeTripOffer = {
  id: string;
  request_id: string;
  driver_user_id: string;
  vehicle_id: string;
  offer_status: string;
  offered_at: string | null;
  responded_at: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  trip_id: string | null;
  trip_created: boolean;
};

export type TripOffersResult =
  | { ok: true; data: SafeTripOffer[] }
  | { ok: false; error: { message: string } };

export type TripOfferResult =
  | { ok: true; data: SafeTripOffer }
  | { ok: false; error: { message: string } };

type RpcResponse<TRow> = {
  data: TRow[] | TRow | null;
  error: { message?: string } | null;
};

export type TripOfferRpcClient = {
  rpc: <TRow = unknown>(name: string, args?: Record<string, unknown>) => Promise<RpcResponse<TRow>>;
};

type RpcTripOfferRow = {
  id?: unknown;
  request_id?: unknown;
  driver_user_id?: unknown;
  vehicle_id?: unknown;
  offer_status?: unknown;
  offered_at?: unknown;
  responded_at?: unknown;
  expires_at?: unknown;
  created_at?: unknown;
  updated_at?: unknown;
  trip_id?: unknown;
  trip_created?: unknown;
};

const SAFE_TRIP_OFFERS_LOAD_ERROR = 'We could not load your trip offers right now.';
const SAFE_TRIP_OFFER_RESPONSE_ERROR = 'We could not respond to this trip offer right now. Please try again.';

function stringOrNull(value: unknown) {
  return typeof value === 'string' ? value.trim() : null;
}

function toSafeTripOffer(row: RpcTripOfferRow | null | undefined): SafeTripOffer {
  return {
    id: stringOrNull(row?.id) ?? '',
    request_id: stringOrNull(row?.request_id) ?? '',
    driver_user_id: stringOrNull(row?.driver_user_id) ?? '',
    vehicle_id: stringOrNull(row?.vehicle_id) ?? '',
    offer_status: stringOrNull(row?.offer_status) ?? 'offered',
    offered_at: stringOrNull(row?.offered_at),
    responded_at: stringOrNull(row?.responded_at),
    expires_at: stringOrNull(row?.expires_at),
    created_at: stringOrNull(row?.created_at),
    updated_at: stringOrNull(row?.updated_at),
    trip_id: stringOrNull(row?.trip_id),
    trip_created: row?.trip_created === true,
  };
}

function normalizeResponse(value: 'accepted' | 'rejected') {
  return value;
}

export async function getMyDriverTripOffers(client: TripOfferRpcClient): Promise<TripOffersResult> {
  try {
    const { data, error } = await client.rpc<RpcTripOfferRow>('get_my_driver_trip_offers');

    if (error) {
      return { ok: false, error: { message: SAFE_TRIP_OFFERS_LOAD_ERROR } };
    }

    const rows = Array.isArray(data) ? data : data ? [data] : [];
    return { ok: true, data: rows.map(toSafeTripOffer) };
  } catch {
    return { ok: false, error: { message: SAFE_TRIP_OFFERS_LOAD_ERROR } };
  }
}

export async function respondToMyTripOffer(
  client: TripOfferRpcClient,
  input: { offerId: string; response: 'accepted' | 'rejected' },
): Promise<TripOfferResult> {
  try {
    const { data, error } = await client.rpc<RpcTripOfferRow>('respond_to_my_trip_offer', {
      p_offer_id: input.offerId,
      p_response: normalizeResponse(input.response),
    });

    if (error) {
      return { ok: false, error: { message: SAFE_TRIP_OFFER_RESPONSE_ERROR } };
    }

    const row = Array.isArray(data) ? data[0] : data;
    return { ok: true, data: toSafeTripOffer(row) };
  } catch {
    return { ok: false, error: { message: SAFE_TRIP_OFFER_RESPONSE_ERROR } };
  }
}
