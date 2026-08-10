# Tasks Assignment

Owner: **ihihamst** · Timezone: **Asia/Karachi (PKT, UTC+05:00)** · Last updated: **2026-08-10**

Mirror of `tasks.json` in readable form. `tasks.json` remains the source of truth — update it first, then regenerate this file.

## Week 2026-08-10 → 2026-08-16

### 1. [ ] Account based Zone Changes

Status: **pending** · Added 2026-08-03 · Updated 2026-08-10

- [ ] Deploy releases on STS.
  - _Updated 2026-08-03_
- [ ] Create a Account based Zone (setup on STS), verify on call taker that account based zone is getting applied.
  - _Updated 2026-08-03_

### 2. [ ] STS Migration to Allegany

Status: **pending** · Added 2026-08-03 · Updated 2026-08-10

- [ ] Deploy and verify latest release changes on Allegany/Cat staging server. All Allegany/Cat existing business flow should work.
  - _Updated 2026-08-03_
- [ ] Deploy and verify latest release changes on Annapolis staging server. All Annapolis existing business flow should work.
  - _Updated 2026-08-03_
- [ ] Prepare migration utility to migrate the STS data into Allegany/Cat server.
  - _Updated 2026-08-03_

### 3. [ ] SendTripUpdateToDevice (move implementation from Inload API to Separate Utility)

Status: **pending** · Added 2026-08-03 · Updated 2026-08-10

- [ ] Migrate the existing utility into .net core service/console.
  - _Updated 2026-08-03_
- [ ] Move the code of SendTripUpdateToDevice to this utility with timer configuration. Also optimize its code.
  - _Updated 2026-08-03_
- [ ] Implement new udp layer to register/send the udp messages
  - _Updated 2026-08-03_
- [ ] Implement file based logging in it.
  - _Updated 2026-08-03_

### 4. [ ] Convert Auto Oara to .net Core Stand Alone Service

Status: **pending** · Added 2026-08-05 · Updated 2026-08-10


### 5. [ ] SilverRide SF Bay area pricing

Status: **pending** · Added 2026-08-03 · Updated 2026-08-10

- [ ] We need to add new zones (City/County) & (Peninsula [areas between two cities])
  - _Updated 2026-08-03_
- [ ] Route Surcharge (if trip covers a route (stored as polygons) defined percentage, then apply surcharge)
  - _Notes:_ Table Route Surcharge [Polygon Coordinates, Percentage Route Covered, Surcharge Amount]
  - _Updated 2026-08-03_

### 6. [ ] Annapolis Stations and RCZ Syncing

Status: **pending** · Priority: **low** · Added 2026-08-05 · Updated 2026-08-10

- [ ] Annapolis needs Stations and RCZ syncing enabled via old path.
  - _Updated 2026-08-05_

### 7. [ ] Water Taxi - Trip cancelled state not synced to OL

Status: **pending** · Added 2026-08-10 · Updated 2026-08-10

- [ ] For Confirmation No. 1780034693 (WaterTaxi Microtransit, Service ID 4662746, due 8/9/2026 12:55:00PM), trip state (Cancelled) was not synced to OL. Service Status in IL is CancelledARQ.

## Week 2026-08-03 → 2026-08-09

### 1. [x] CH Taxi - Fare Not calculating properly

Status: **done** · Added 2026-08-03 · Updated 2026-08-05 14:30:00+05:00 · Completed 2026-08-05 14:30:00+05:00

- [x] For CH Taxi FS = API Global Solutions, Fare zone is not getting computed properly.
  - _Notes:_ Fix: Entry was missed in dtl_AffiliateClassOfService table, due to which for this FS, fare zone were not computing.
  - _Updated 2026-08-05 · Completed 2026-08-05_
- [x] Write a script which inserts a missing entry in dtl_AffiliateClassofService table, if entry for FS or COS is missing in this table for a given affiliate.
  - _Added 2026-08-05_

### 2. [x] SilverRide 3 affiliates into 1 Affiliate Merger (SR - Element PACE & SR - Harbor Health Boston into SR - Boston PACE)

Status: **done** · Added 2026-08-03 · Updated 2026-08-05 · Completed 2026-08-05

- [x] Write merger script
  - _Notes:_ Delivered.

### 3. [x] Add RiderID and pickup/drop time windows to AdditionalDeviceParameters JSON

Status: **done** · Added 2026-08-06 · Updated 2026-08-06 · Completed 2026-08-06

- [x] Add RiderID and pickup/drop time windows to AdditionalDeviceParameters JSON so that they become available on the driver app.
- [x] Worked on the recording of the window from Routing algorithm.

### 4. [x] Water Taxi Support

Status: **done** · Added 2026-08-03 · Updated 2026-08-09 · Completed 2026-08-09

- [x] If Station is selected as a location, it dont allow booking due to mis-match in station names in OL & IL

### 5. [x] CHTAXI Booking App, CC was not getting added

Status: **done** · Added 2026-08-07 · Updated 2026-08-07 · Completed 2026-08-07

- [x] In Slim CD CC flow, brand id was not getting saved with CC Profiles. And fetch API rely on CC Profiles being fetched via Brand ID. Fixed.
