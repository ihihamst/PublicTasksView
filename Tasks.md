# Tasks Assignment

Owner: **ihihamst** · Timezone: **Asia/Karachi (PKT, UTC+05:00)** · Last updated: **2026-09-02**

Mirror of `tasks.json` in readable form. `tasks.json` remains the source of truth — update it first, then regenerate this file with `python3 scripts/generate_tasks_md.py`.

## Week 2026-08-31 → 2026-09-04

### 1. [ ] Zone Management

Status: **in-progress** · Priority: **high** · Added 2026-08-11 · Updated 2026-08-28

_Notes:_ Missing and pending functionalities in the new Zone Management portal. The remaining GTFS and City/State/Zip plotting is top priority as per Iqbal sb (Aug 24).

- [x] From legacy Web MRMS, we should open new screen of Zone Management via auto login and auto redirect to it.
  - _Updated 2026-08-13 · Completed 2026-08-13_
- [x] If zone names are too many, they cut-off.
  - _Updated 2026-08-13 · Completed 2026-08-13_
- [ ] Implement zone polygone plotting for City/State/Zip.
- [ ] Implement the zone polygone plot by GTFS feed.
- [ ] It should use common configurations of app or api.
  - _Added 2026-08-28_
- [ ] Any api key or url should come from config (only if it can change server to server).
  - _Added 2026-08-28_

### 2. [ ] SilverRide SF Bay area pricing

Status: **pending** · Priority: **high** · Added 2026-08-03 · Updated 2026-08-24

_Notes:_ Top priority as per Imran sb (Aug 24).

- [ ] We need to add new zones (City/County) & (Peninsula [areas between two cities])
- [ ] Route Surcharge (if trip covers a route (stored as polygons) defined percentage, then apply surcharge)
  - _Notes:_ Table Route Surcharge [Polygon Coordinates, Percentage Route Covered, Surcharge Amount]

### 3. [ ] Implement PendingAPICallsAndTripUpdatesUtility

Status: **in-progress** · Added 2026-08-03 · Updated 2026-08-31

_Notes:_ The PendingAPICalls side is done and delivered. The points for SendTripUpdateToDevice - moving the implementation out of the Inload API into this utility - are still pending.

- [x] PendingAPICalls - implement the process of invoking the PendingAPICalls from this utility. Maintain sequential lane (one) + configurable concurrent lanes (default 128).
  - _Added 2026-08-31 · Completed 2026-08-31_
- [x] PendingAPICalls - both types of lanes will utilize shared threading only when work is being done in the utility, otherwise it will release the thread and wait for the network call to return.
  - _Added 2026-08-31 · Completed 2026-08-31_
- [x] PendingAPICalls - implement admin dashboard to view stats, logs, requests/responses, queues.
  - _Added 2026-08-31 · Completed 2026-08-31_
- [x] PendingAPICalls - implement the installer (WiX) to install this as a Windows service. The installer also helps in configuring the connection string and app settings.
  - _Added 2026-08-31 · Completed 2026-08-31_
- [ ] Migrate the existing utility into .net core service/console.
- [ ] Move the code of SendTripUpdateToDevice to this utility with timer configuration. Also optimize its code.
- [ ] Implement new udp layer to register/send the udp messages
- [ ] Implement file based logging in it.

### 4. [ ] Convert Auto Oara to .net Core Stand Alone Service

Status: **pending** · Added 2026-08-05 · Updated 2026-08-10

### 5. [ ] Annapolis Stations and RCZ Syncing

Status: **pending** · Priority: **low** · Added 2026-08-05 · Updated 2026-08-10

- [ ] Annapolis needs Stations and RCZ syncing enabled via old path.

### 6. [ ] Water Taxi - Trip cancelled state not synced to OL

Status: **pending** · Added 2026-08-10 · Updated 2026-08-10

- [ ] For Confirmation No. 1780034693 (WaterTaxi Microtransit, Service ID 4662746, due 8/9/2026 12:55:00PM), trip state (Cancelled) was not synced to OL. Service Status in IL is CancelledARQ.

### 7. [ ] Saint Mary - trip zone becomes UNKWN on trip expansion

Status: **pending** · Added 2026-08-24 · Updated 2026-08-24

- [ ] Saint Mary trips zone become UNKWN on trip expansion. Issue needs to be fixed.

### 8. [ ] GTA - frplanning API returning wrong affiliate data

Status: **in-progress** · Added 2026-08-27 · Updated 2026-08-28

- [x] gtafrplanningapi.itcurves.us/ZoneManagement/GetAllActiveAffiliates is bringing wrong data. Configurations of the frplanning API to be checked.
  - _Completed 2026-08-28_
- [ ] Zone Management needs a common configuration, not a separate configuration.
  - _Added 2026-08-28_

### 9. [x] Web MRMS Security - support fixes

Status: **done** · Added 2026-09-01 · Updated 2026-09-01 · Completed 2026-09-01

_Notes:_ Fixes were done in the central class.

- [x] Export not working from Processing Center.
- [x] FS were not filtering on affiliate change.
- [x] Investigated frequent sign out and app crashes.

### 10. [x] Bigger RefID value needs BIGINT - stored procedure errors

Status: **done** · Added 2026-09-01 · Updated 2026-09-01 · Completed 2026-09-01

- [x] Dispatch grid was not showing data (SP fixed).
- [x] BOARA Trips were not moving (SP fixed).

### 11. [x] CAT setup Fare = 0 for Route 7 Fare Zones (#CAT-TK-74)

Status: **done** · Added 2026-09-02 · Updated 2026-09-02 · Completed 2026-09-02

- [x] Imported the fare zones into CAT production from excel file.
- [x] Done Fare = 0 setup by creating Fare attributes and their combinations.

### 12. [x] Fare Zone screen not opening - drawing library error

Status: **done** · Added 2026-09-02 · Updated 2026-09-02 · Completed 2026-09-02

- [x] Fare zone screen was giving a drawing library error and it was not opening. Currently just fixed this screen by increasing the version. Permanent fix will be done later.

## Week 2026-08-24 → 2026-08-30

### 1. [x] AVL Playback broken - Google retired the Drawing Manager

Status: **done** · Added 2026-08-24 · Updated 2026-08-24 · Completed 2026-08-24

- [x] Playback code used the Google drawing library, which Google has now retired. Replaced it with another drawing tool library and gave the release.
- [x] Release provided for Eastern production deployment - existing release backed up first, no DB scripts needed.

## Week 2026-08-17 → 2026-08-23

### 1. [x] Taxi US - SDHS down and restart failing

Status: **done** · Added 2026-08-17 · Updated 2026-08-17 · Completed 2026-08-17

- [x] SDHS was down and restarting it kept giving an error. It happened because of the "." in driverno record "318126" - the stored procedure was converting it to integer and failing. Fixed, SDHS is running fine and drivers are logging in.

### 2. [x] Saint Mary app - activation code SMS not received

Status: **done** · Added 2026-08-17 · Updated 2026-08-18 · Completed 2026-08-18

- [x] App ids saintmary_android / saintmary_ios did not exist in the portal, so preActivation answered "contact backoffice" and no SMS was generated. After fixing the app ids on the test server, the activation SMS was received.

### 3. [x] Create "Drivers and Vehicles" role for restricted user access

Status: **done** · Added 2026-08-19 · Updated 2026-08-20 · Completed 2026-08-20

- [x] Added the role through a script into SecMgmt.sec_Roles and assigned it to the user. They have to log out and log back in for it to take effect.

### 4. [x] GTA - trip investigations (110821663, 110821690, 110821992)

Status: **done** · Added 2026-08-21 · Updated 2026-08-21 · Completed 2026-08-21

- [x] Trip 110821663: Dropped never came from the device.
- [x] Trip 110821690: the driver accepted it nine seconds before departing on 110821663 - he stacked it while starting another ride and never returned to it. The session ended at 16:40, ten minutes before this trip's 16:50 scheduled pickup; the entry log holds exactly one call, the ACCEPTED at 15:52:30.
- [x] Trip 110821992: dropped due to the SDHS context bug.

### 5. [x] CH-Taxi booking app reporting wrong city

Status: **done** · Added 2026-08-17 · Updated 2026-08-21 · Completed 2026-08-21

- [x] CH-Taxi booking app is reporting the wrong city. Needs to be investigated with Hinnan.
  - _Notes:_ Checked and handed over to Hinnan for later investigation. Done from my side.

### 6. [x] Web Applications & API Security

Status: **done** · Priority: **high** · Added 2026-08-11 · Updated 2026-08-23 · Completed 2026-08-23

- [x] Legacy Web MRMS security - Dont allow accessing any endpoint without authentication at central handler in Owin pipeline.
  - _Updated 2026-08-19 · Completed 2026-08-19_
- [x] Legacy Web MRMS security - Wrong 3 authentication attempts should trigger the lockout for that ip address (keep it in memory, if app restart we would loose it).
  - _Notes:_ 3 failed attempts lock that IP for 15 minutes. Per-IP only - it does not affect other users or anyone already signed in.
  - _Updated 2026-08-19 · Completed 2026-08-19_
- [x] Legacy Web MRMS security - Identify any end point that can face problem due to this new security implementation.
  - _Notes:_ Endpoint map built: 529 endpoints / 3,127 routes with their tags, shipped as a JSON file loaded at application start.
  - _Updated 2026-08-19 · Completed 2026-08-19_
- [x] Legacy Web MRMS security - This central authentication should also cater the User assigned module security via tags discovery.
  - _Updated 2026-08-19 · Completed 2026-08-19_
- [x] Legacy Web MRMS security - If user is not assigned the Service provider A, then they should not see any A service provider or its data.
  - _Notes:_ Affiliate IDs in a request are validated against the user's assigned affiliates; disallowed IDs are removed and the request is refused only if none remain. The endpoints that were not passing affiliate IDs are now covered too.
  - _Updated 2026-08-28 · Completed 2026-08-28_
- [x] Anti-forgery protection on all login pages, browser-only access, optional session IP binding, and denial logging (user, path, reason) to a protected folder that is not web-accessible.
  - _Notes:_ 8 Web.config switches: master on/off, skip tag checks, skip affiliate scoping, per-path overrides, lockout policy, anti-forgery + logging, session IP binding, browser filter.
  - _Added 2026-08-19 · Completed 2026-08-19_
- [x] Deploy the central endpoint security release. Done on SIV-WebMRMSTemp (test, port 8443), SIV-WebMRMS, Eastern production and GTA.
  - _Notes:_ Eastern production release handed over on Aug 24 (existing release backed up first, no DB scripts needed); GTA deployed this week.
  - _Added 2026-08-19 · Updated 2026-08-28 · Completed 2026-08-28_
- [x] UI Parity Check (tgistaging vs 192.168.6.8) - Opened both sites in Chrome, confirmed same database via matching trip counters.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] UI Parity Check (tgistaging vs 192.168.6.8) - Compared 6 of 198 screens - all identical, verified by grid hashes.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] UI Parity Check (tgistaging vs 192.168.6.8) - Confirmed menu structure identical on both (371 links, matching hash).
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] UI Parity Check (tgistaging vs 192.168.6.8) - Found Site 1 correctly blocks token-less direct URLs - by design, not a defect.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] UI Parity Check (tgistaging vs 192.168.6.8) - Caught 2 false alarms caused by mid-load screenshots; both matched once settled.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Diagnostics Dashboard Review - Reviewed Diagnostics.aspx + JSON endpoint; listed 12 issues by severity.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Diagnostics Dashboard Review - Found CSV formula injection in Export CSV and residual CSRF on "reload=true".
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Diagnostics Dashboard Review - Probed live gtatms anonymously - confirmed both auth gates fire correctly.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Diagnostics Dashboard Review - Analysed production snapshot: 94% of denials were self-inflicted poller noise.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Fixes Implemented - Fix 1+2 - added session-death latch + abort prefilter; stops all 25+ pollers.
  - _Notes:_ 923 insertions across 12 files, builds clean.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Fixes Implemented - Fix 1+2 - wired up AsyncJSONAjax's error callback, declared but never used.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Fixes Implemented - Fix 3 - new "affexempt" mode; unblocks the global settings lookup on -1.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Fixes Implemented - Fix 4 - substring recognition of affiliate params; recovers 298 unscoped requests.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Fixes Implemented - Fix 5 - X-ES-Service header so self-calls survive the User-Agent filter.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Fixes Implemented - Fix 8 - lockout re-keyed to Username+IP, with coarse per-IP ceiling retained.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Dashboard Improvements - Active Sessions now records and displays browser info + raw User-Agent.
  - _Added 2026-08-28 · Completed 2026-08-28_
- [x] Dashboard Improvements - Function Timing rows now clickable, showing request/response detail.
  - _Added 2026-08-28 · Completed 2026-08-28_

## Week 2026-08-10 → 2026-08-16

### 1. [x] Account based Zone Changes

Status: **done** · Added 2026-08-03 · Updated 2026-08-10 · Completed 2026-08-10

_Notes:_ Releases provided & uploaded.

- [x] Deploy releases on STS.
- [x] Create a Account based Zone (setup on STS), verify on call taker that account based zone is getting applied.
- [x] Call Taker Account based Zone verified. Fixed call triggering issues in call taker. Double message of Service Hours was coming due to it getting invoked from two places. Fixed
  - _Added 2026-08-10_
- [x] Inload API was missing some account based zone changes. Added and verified.
  - _Added 2026-08-10_

### 2. [x] Edit Treated - applied three fixes

Status: **done** · Added 2026-08-10 · Updated 2026-08-10 22:00:00+05:00 · Completed 2026-08-10 22:00:00+05:00

Link: [CAT-TK-63](https://track.itcurves.us/?view=ticket_details&ticketId=CAT-TK-63)

_Notes:_ All these fixes are deployed on CatTMS.

- [x] Performance issue
- [x] Cancel reason selection issue
- [x] Trip Type not auto selecting Normal

### 3. [x] usp_IBPC_GetAccessExportData â€” ClientBillingSupport block: show both legs' Agent Notes for Broker-Affiliate trips

Status: **done** · Added 2026-08-11 · Updated 2026-08-11 · Completed 2026-08-11

- [x] Notes are recorded against only one leg of a brokered trip, so the export currently misses roughly half of them. The block will resolve the counterpart trip via dtl_ServiceRequestThirdPartyMapping (live mapping, both directions) and return its notes on a separate row under the same RefID. Non-brokered trips unchanged. Also applied to the _Western variant.
  - _Notes:_ Worked on newly added query optimization too.

### 4. [x] New release deploy on Allegany/CAT. Verification & Support

Status: **done** · Added 2026-08-10 · Updated 2026-08-10 · Completed 2026-08-10

- [x] Provided SDHS Service release as setup file to install/uninstall the SDHS.
- [x] Zone management portal - has UI issues because of too many Zones. Fixed it.

### 5. [x] GTA - IRTPU trips got treated without any action or reason

Status: **done** · Added 2026-08-11 · Updated 2026-08-11 · Completed 2026-08-11

- [x] After investigation, it was found that in manifest one of the trip was marked as Dropped, but it was not treated, instead this innocent trip of same manifest got treated. Issue in SDHS variable which is a shared variable. This shared variable issue, I have fixed too for new releases.
- [x] In sp usp_MRMC_TreatedRequest I have added protection to protect in this scenario, after discussion with Iqbal sb. This sp is deployed on Eastern2 and GTA to provide immediate remedy until new SDHS release is deployed.

### 6. [x] STS Migration to Allegany

Status: **done** · Added 2026-08-03 · Updated 2026-08-14 · Completed 2026-08-14

- [x] Deploy and verify latest release changes on Annapolis staging server. All Annapolis existing business flow should work.
- [x] Prepare migration utility to migrate the STS data into Allegany/Cat server.
  - _Updated 2026-08-10 · Completed 2026-08-10_
- [x] Issues reported in migration - a. Zone zig-zag, it happened due to migrating data missed the order by clause. Re-importing data fixed it.
  - _Added 2026-08-11 · Completed 2026-08-10_
- [x] Issues reported in migration - b. For future date, when time is not set, call taker 2.0 act as today date in zone/service hour calculation.
  - _Added 2026-08-11_
- [x] Implement the application of booking rules (if setting ApplyZoneBookingRules is true) on the Load & Verify screen.
  - _Added 2026-08-11_

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
