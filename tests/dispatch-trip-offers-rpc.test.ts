import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getMyDriverTripOffers,
  respondToMyTripOffer,
  type TripOfferRpcClient,
} from '../src/lib/dispatch/trip-offers';

test('trip offer helpers call only approved driver RPCs', async () => {
  const calls: Array<{ name: string; args?: Record<string, unknown> }> = [];
  const client: TripOfferRpcClient = {
    async rpc<TRow>(name: string, args?: Record<string, unknown>) {
      calls.push({ name, args });
      return {
        data: {
          id: 'offer-1',
          request_id: 'request-1',
          driver_user_id: 'driver-1',
          vehicle_id: 'vehicle-1',
          offer_status: 'accepted',
          offered_at: '2026-06-24T21:00:00Z',
          responded_at: '2026-06-24T21:00:30Z',
          expires_at: '2026-06-24T21:00:45Z',
          trip_id: 'trip-1',
          trip_created: true,
          metadata: { hidden: true },
        } as TRow,
        error: null,
      };
    },
  };

  const listResult = await getMyDriverTripOffers(client);
  const responseResult = await respondToMyTripOffer(client, { offerId: 'offer-1', response: 'accepted' });

  assert.deepEqual(calls, [
    { name: 'get_my_driver_trip_offers', args: undefined },
    { name: 'respond_to_my_trip_offer', args: { p_offer_id: 'offer-1', p_response: 'accepted' } },
  ]);
  assert.equal(listResult.ok, true);
  assert.equal(responseResult.ok, true);
  if (responseResult.ok) {
    assert.equal(responseResult.data.offer_status, 'accepted');
    assert.equal(responseResult.data.trip_id, 'trip-1');
    assert.equal(responseResult.data.trip_created, true);
    assert.equal('metadata' in responseResult.data, false);
  }
});

test('trip offer helpers map backend errors safely', async () => {
  const client = {
    async rpc<TRow>() {
      return { data: null as TRow | null, error: { message: 'internal dispatch.trip_offers denied' } };
    },
  };

  const listResult = await getMyDriverTripOffers(client);
  const responseResult = await respondToMyTripOffer(client, { offerId: 'offer-1', response: 'rejected' });

  assert.equal(listResult.ok, false);
  assert.equal(responseResult.ok, false);
  if (!listResult.ok) assert.equal(listResult.error.message.includes('dispatch.trip_offers'), false);
  if (!responseResult.ok) assert.equal(responseResult.error.message.includes('dispatch.trip_offers'), false);
});
