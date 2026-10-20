# Tasks Assignment

Owner: **ihihamst** · Timezone: **Asia/Karachi (PKT, UTC+05:00)**

Mirror of `tasks.json` in readable form. `tasks.json` remains the source of truth — update it first, then regenerate this file with `python3 scripts/generate_tasks_md.py`.

## Week 2026-10-19 → 2026-10-25

### 1. [ ] Implement PendingAPICallsAndTripUpdatesUtility

Status: **in-progress** · Added 2026-08-03 · Updated 2026-10-20

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

### 5. [ ] SilverRide SF Bay area pricing

Status: **in-progress** · Priority: **high** · Added 2026-08-03 · Updated 2026-10-20

Link: [SR-TK-9](https://track.itcurves.us/?view=ticket_details&ticketId=SR-TK-9)

_Notes:_ Top priority as per Imran sb (Aug 24).

- [ ] We need to add new zones (City/County) & (Peninsula [areas between two cities])
- [ ] Route Surcharge (if trip covers a route (stored as polygons) defined percentage, then apply surcharge)
  - _Notes:_ Table Route Surcharge [Polygon Coordinates, Percentage Route Covered, Surcharge Amount]
- [x] Make a complete design for this SilverRide SF Bayarea Pricing
  - _Added 2026-09-08 · Updated 2026-09-07 · Completed 2026-09-07_

### 6. [ ] Email Matthew about my AI usage and its benefits

Status: **pending** · Added 2026-09-10 · Updated 2026-10-20

- [ ] Send an email to Matthew explaining how my AI use is going and how I am benefitting from it.

### 7. [ ] Convert Auto Oara to .net Core Stand Alone Service

Status: **pending** · Added 2026-08-05 · Updated 2026-09-11

### 8. [x] #IMB-TK-20 - Route not brokering: bTripCanceledInThirdParty not set on take back

Status: **done** · Added 2026-09-11 · Updated 2026-10-20 · Completed 2026-10-20

Link: [IMB-TK-20](https://track.itcurves.us/?view=ticket_details&ticketId=IMB-TK-20)

- [x] Route not brokering. Upon take back, bTripCanceledInThirdParty was not getting set for the record of the previous affiliate (when certain conditions happen), and due to this the trip was not going to the new affiliate.

### 11. [x] SDHS crash - second fix

Status: **done** · Added 2026-10-20 · Updated 2026-10-20 · Completed 2026-10-20

- [x] SDHS Service release containing the fix for SDHS crashing and the service getting stopped.

### 12. [x] Annapolis RCZ to Zone migration - testing and verification

Status: **done** · Added 2026-10-20 · Updated 2026-10-20 · Completed 2026-10-20

- [x] Annapolis verification complete. One fix was needed, provided as a DB-Script to be made part of the package.

### 13. [ ] ITC Common Data endpoints for third parties (Broker-Provider docs, OAuth, Swagger)

Status: **pending** · Added 2026-10-14 · Updated 2026-10-20

- [x] Implement and deploy the Common Data endpoints for third parties on Staging (Broker-Provider documentation, OAuth, Swagger).
  - _Completed 2026-10-14_
- [ ] Edits need to be done via ITC entity ID, and this entity ID needs to be sent in the fetch response.
  - _Added 2026-10-20_

### 14. [ ] Annapolis migration into Allegany DB via script

Status: **pending** · Added 2026-10-20 · Updated 2026-10-20

- [ ] Migrate Annapolis into the Allegany DB via script, once Annapolis is on the latest release.

### 15. [ ] TLS check utility for our APIs and endpoints

Status: **pending** · Added 2026-10-20 · Updated 2026-10-20

- [ ] Provide a utility which calls our different APIs & endpoints and confirms if TLS works with them.

### 16. [x] #IMB-TK-36 - Eastern TMS: trip will not clear

Status: **done** · Priority: **normal** · Added 2026-10-20 · Updated 2026-10-20 · Completed 2026-10-20

Link: [IMB-TK-36](https://track.itcurves.us/?view=ticket_details&ticketId=IMB-TK-36)

_Notes:_ Created by Tom Durfee on 6 Oct 2026 (IMB Serv). Track: Assigned, High. Start 10/5/2026, due 10/14/2026, no expected date. Ticket: "Western TMS: We have a trip stuck on the broker side, but it does not appear on the affiliate side. This trip will flush and not report correctly. The trip was a no show." 2 screenshots attached. Iqbal Ashraf (6 Oct): "Please look into". Note: the title says Eastern but the text says Western; confirm the region.

- [x] Get the trip/confirmation no from the screenshots and confirm the region (Eastern vs Western TMS).
- [x] Trace the trip on both sides: broker trip and leg tables vs affiliate tables, dtl_PendingAPICalls and third-party logs. Find why the affiliate never received it, or lost it on no-show.
- [x] Fix the data: clear or close the stuck broker trip with the no-show outcome so it flushes and reports correctly.
- [x] Fix the root cause if it is a code path (e.g. a no-show on an unrouted or taken-back trip not propagating), and update the ticket.

### 17. [x] #AT-TK-13 - Annapolis: merge client profiles

Status: **done** · Priority: **high** · Added 2026-10-20 · Updated 2026-10-19 · Completed 2026-10-19

Link: [AT-TK-13](https://track.itcurves.us/?view=ticket_details&ticketId=AT-TK-13)

_Notes:_ Created by Abhijeet Nawale on 17 Sep 2026 (Annapolis Transit / Annapolis Microtransit). Track: Fixed (since 19 Oct), Critical. Start 9/16/2026, due 9/25/2026, no expected date. Assigned to Muhammad Awais and Ihtesham Hussain. Ticket: "Client id # 424593 and 426738 are for the same client. Can we merge these 2 profiles." Awais (19 Oct): a new screen was created for this purpose and integrated in WebMRMS-3.0.

- [x] Client merge screen created and integrated in WebMRMS-3.0 (Muhammad Awais).
  - _Added 2026-10-19_
- [x] Merge clients 424593 and 426738 on Annapolis with the new screen, or deploy the release that has it to Annapolis first.
- [x] Verify trips, history and funding sources moved to the surviving profile, then move the ticket to Testing/Resolved.

### 21. [x] #GTA-TK-29 - GTA zones and wrong attributes issue

Status: **done** · Priority: **high** · Added 2026-10-20 · Updated 2026-10-20 · Completed 2026-10-20

Link: [GTA-TK-29](https://track.itcurves.us/?view=ticket_details&ticketId=GTA-TK-29)

_Notes:_ Created by Ihtesham Hussain on 6 Aug 2026 (Grant Transit Authority). Track: Open, Critical. Start 6/22/2026, due 7/1/2026, no expected date. Ticket: GTA has overlapping zones and they are not getting calculated consistently; the mechanism needs fixing. Also need to recompute and apply the attributes as per the new zones.

- [x] Export GTA zones and list the overlapping polygons; decide the rule (zone priority / smallest-area wins) with the GTA team.
- [x] Make zone resolution deterministic for overlaps in the zone calculation code and SPs, ordered by an explicit priority instead of whatever row comes first.
- [x] Write a script to recompute zones for current and future trips and re-apply zone attributes; run on GTA staging, then production.
- [x] Update the ticket (it is still Open on track).

### 22. [x] #BRT-TK-4 - Barwood & Regency: cleanup PIM list

Status: **done** · Priority: **high** · Added 2026-10-20 · Updated 2026-10-20 · Completed 2026-10-20

Link: [BRT-TK-4](https://track.itcurves.us/?view=ticket_details&ticketId=BRT-TK-4)

_Notes:_ Created by Kevin Rivas on 22 May 2026 (Barwood & Regency). Track: Assigned, Critical. Start 4/15/2026, due 4/24/2026, no expected date. Ticket: "Kindly remove any PIM devices which have a LastUpdatedDate before April 2026." 1 attachment, 1 pending subtask on track.

- [x] Query the PIM device table for rows with LastUpdatedDate before 2026-04-01 and share the count/list with Kevin.
- [x] Back up those rows, then delete or deactivate them (check FKs to vehicles and drivers first).
- [x] Confirm with Kevin, then close the track subtask and ticket.

### 23. [ ] #IMB-TK-9 - IMB: agent notes are not saving

Status: **pending** · Priority: **high** · Added 2026-10-20 · Updated 2026-10-20

Link: [IMB-TK-9](https://track.itcurves.us/?view=ticket_details&ticketId=IMB-TK-9)

_Notes:_ Created by Muhammad Zahid on 1 Apr 2026 (IMB Serv). Track: Assigned, Critical. No start date, due 4/10/2026, no expected date. Ticket: "Unable to save agent notes." No discussion yet.

- [ ] Ask Zahid for the screen, environment and an example trip/client; it has been open ~200 days, so confirm it still happens.
- [ ] Reproduce and check the save call (API/SP) for errors, field length or permission issues.
- [ ] Fix, release, verify, and update the ticket.

### 24. [ ] #IMB-TK-2 - Update logic for Shell User profile creation in assigned tenants

Status: **pending** · Priority: **high** · Added 2026-10-20 · Updated 2026-10-20

Link: [IMB-TK-2](https://track.itcurves.us/?view=ticket_details&ticketId=IMB-TK-2)

_Notes:_ Created by Iqbal Ashraf on 30 Mar 2026 (IMB Serv). Track: Assigned, Critical. No start date, due 4/8/2026, no expected date. Ticket: when a Shell User profile is created in an assigned tenant, copy the Email from the primary user record; replace the generic username (e.g. ShellUser123) with ShellUser-[TSP-ID]-[OriginalUsername]. Example: Roschelle was manually updated to ShellUser-159-rayonayon. Purpose: let affiliate admins see which primary tenant user a shell user belongs to.

- [ ] Find the shell-user creation code/SP for assigned tenants.
- [ ] Copy Email from the primary user and generate the username as ShellUser-[TSP-ID]-[OriginalUsername] (handle length limits and uniqueness).
- [ ] Write a one-time script to rename existing shell users and back-fill emails.
- [ ] Release, verify on IMB, and update the ticket.

## Week 2026-10-12 → 2026-10-18

### 1. [x] Broker on UnAssign not sending cancel when only one affiliate is serving

Status: **done** · Added 2026-10-16 · Updated 2026-10-16 · Completed 2026-10-16

- [x] BOARA Mode 0: for unassign rows skipped because the trip went back to the same affiliate, queue an ExternalDispatch\CancelRequest call to the third party through dtl_PendingAPICalls.

### 2. [x] GTA - POI service hours (cutoff time) fix

Status: **done** · Added 2026-10-16 · Updated 2026-10-16 · Completed 2026-10-16

- [x] Mode 5 added in usp_GetNUpdateAffiliateServiceHours to check if POI has its own service hours. GTA Reservation API patch release deployed in Production.

### 3. [x] Eastern AVL to SilverRide

Status: **done** · Added 2026-10-16 · Updated 2026-10-16 · Completed 2026-10-16

- [x] Started sending vehicle location updates for the SilverRide affiliates on the Eastern2 server.

### 4. [x] GTA - IVR-AI trips missing attributes

Status: **done** · Added 2026-10-16 · Updated 2026-10-16 · Completed 2026-10-16

- [x] IVR visibility was not set in zone attributes. Set the attribute visibility and fixed the attributes of current and future IVR trips.

### 5. [x] GTA IVR - skip attribute visibility check for bookings from apps without UI

Status: **done** · Added 2026-10-16 · Updated 2026-10-16 · Completed 2026-10-16

- [x] Code fix so trip booking from apps which don't have a UI does not check attribute visibility.

### 6. [x] SDHS crash / auto-recovery - first fix

Status: **done** · Added 2026-10-16 · Updated 2026-10-16 · Completed 2026-10-16

- [x] SDHS service delayed start and recovery if the DB restarts or disconnects for some time. Fix for SDHS going down and throwing exceptions.

### 7. [x] TGI ND - actual PU/DO lat/longs empty for Smart Trips

Status: **done** · Added 2026-10-16 · Updated 2026-10-16 · Completed 2026-10-16

- [x] Smart sent empty values to the affiliate, which caused the affiliate-side updates from the driver to fail. Code fixed; data was also already fixed.

### 9. [x] SilverRide/IMB - migrate a merged affiliate back out as a separate affiliate

Status: **done** · Added 2026-09-15 · Updated 2026-10-16 · Completed 2026-10-16

- [x] SilverRide/IMB want one of their merged affiliates to be migrated out as a separate affiliate. Discuss with Hassam and plan.

## Week 2026-10-05 → 2026-10-11

### 1. [x] Zone Management - auto login and show only the user's assigned affiliates; Planning Tool deployed on Eastern

Status: **done** · Added 2026-10-09 · Updated 2026-10-09 · Completed 2026-10-09

- [x] Zone Management should auto login and show the user assigned affiliates only. Fixed, released, and deployed on Eastern (provided support).

### 2. [x] CAT - Common Booking password reset fix

Status: **done** · Added 2026-10-09 · Updated 2026-10-09 · Completed 2026-10-09

- [x] Common Web Booking release with the fix of Password Reset failing (CAT Password Reset Issue report).

### 3. [x] MARS - Ring Central SMS Gateway

Status: **done** · Added 2026-10-09 · Updated 2026-10-09 · Completed 2026-10-09

- [x] Outload API release containing Vijay's Ring Central SMS Gateway implementation provided for production; gateway added and activated.

### 10. [x] Server Security Issues

Status: **done** · Added 2026-09-23 · Updated 2026-10-09 · Completed 2026-10-09

- [x] Update Node.js and the global packages on the server to the latest version via script. Verify the script.
  - _Updated 2026-09-25 · Completed 2026-09-25_
- [x] Upgrade / pin the Node version in all Node apps, and upgrade the outdated Node libraries to the latest version (e.g. axios).

## Week 2026-09-21 → 2026-09-27

### 10. [x] Slack Support Issues

Status: **done** · Added 2026-09-21 · Updated 2026-09-21 · Completed 2026-09-21

- [x] GTA: on call taker, inactive zones were showing too. Fixed in the combined data API to bring only active ones.
- [x] Web MRMS 2.0: Quick Edit was giving an error on saving. It was already fixed but not deployed - investigated and deployed it.
- [x] Access trips moved to OL very late. Investigated and shared the cause with Umar Ameen: trips are sent in batches of 5-10 per one-minute iteration, so a bulk insert of 1000 trips can take hours to move.

### 12. [x] De-duplication of Clients

Status: **done** · Added 2026-09-23 · Updated 2026-09-25 · Completed 2026-09-25

- [x] Made a demo app which de-dups the clients after grouping them by criteria, and allows merging of the fields (excluding the system fields).

## Week 2026-09-14 → 2026-09-20

### 7. [x] Saint Mary - Zone to Zone & Service Hours: allow booking across service-hour days

Status: **done** · Added 2026-09-11 · Updated 2026-09-16 · Completed 2026-09-16

- [x] In Saint Mary, Zone to Zone & Service Hours function, we need to allow the booking from another day service hour zone to the destination (which is on this day service hour zone), based on if the rule allows.
- [x] Define the one way rule and return rule separately in the zone booking rules table.
  - _Added 2026-09-16_

### 9. [x] Upgrade Eastern2 APIs from .NET 6 to .NET 10

Status: **done** · Priority: **high** · Added 2026-09-09 · Updated 2026-09-14 · Completed 2026-09-14

_Notes:_ Needed to close server vulnerabilities. Four apps are still on .NET 6: Eastern2-DataSyncAPI, Eastern2.0-CombinedDataAPI, Eastern2.0-GenericManifestAPI and Eastern2.0-ReservationAPI (all under D:\IISWebs). Due tomorrow, 2026-09-10.

- [x] Upgrade all four apps from .NET 6 to .NET 10: Eastern2-DataSyncAPI, Eastern2.0-CombinedDataAPI, Eastern2.0-GenericManifestAPI, Eastern2.0-ReservationAPI.
- [x] Write down the main functions of each app so Abubakar can test them on the staging environment (6.13).
- [x] List any code that will not work on .NET 10, so other teams can be brought in to fix those areas.

### 10. [x] Vehicle Live Screen does not work with a long list of filters

Status: **done** · Added 2026-09-10 · Updated 2026-09-17 · Completed 2026-09-17

- [x] Vehicle Live Screen doesn't work when there's a long list of filters, e.g. Affiliates, attributes etc.
  - _Updated 2026-09-15 · Completed 2026-09-15_
- [x] Vehicle types have strange names or wrong data.
  - _Notes:_ Reported by Zahid sb.
  - _Added 2026-09-16_

### 11. [x] SilverRide/Western server crash investigation

Status: **done** · Added 2026-09-11 · Updated 2026-09-16 · Completed 2026-09-16

_Notes:_ Reported in the meeting that the SilverRide server crashed once again (previous one yesterday), and it only comes back after restarting it.

- [x] Reviewed the event viewer logs (partially), yet no conclusive findings.
  - _Completed 2026-09-11_
- [x] Reviewed the SQL struck queries and tables analysis. They seemed to be ok.
  - _Completed 2026-09-11_
- [x] Then all of a sudden server CPU usage rose, and I checked and found Inload API was taking 83% CPU. I took the dump, did its analysis, and found that dictionary (inside standard utility) was the culprit.
  - _Completed 2026-09-11_
- [x] Setup IIS so that if CPU usage goes above 60%, it will kill the Inload API process.
  - _Completed 2026-09-11_
- [x] Fix the standard utility dictionary issue (use concurrent dictionary after confirming by doing R & D). Verify the fix. Apply the DLL in major applications which use it.
- [x] Scan Inload API, and find and fix other areas in which dictionary is missing the lock during operations, fix and verify.

### 18. [x] #IMB-TK-25 - On broker unroute, take-back did not occur on affiliate side

Status: **done** · Priority: **high** · Added 2026-10-20 · Updated 2026-09-15 · Completed 2026-09-15

Link: [IMB-TK-25](https://track.itcurves.us/?view=ticket_details&ticketId=IMB-TK-25)

_Notes:_ Created by Ihtesham Hussain on 15 Sep 2026 (IMB Serv). Track: Assigned (since 21 Sep), Critical. Start 6/22/2026, due 7/1/2026, no expected date. Ticket: on un-route on the broker side, the system removes the trip entry from the main trips tables, so broker take-back could not happen because broker expected the parent leg. Fix described in ticket: broker take-back made independent of trip record existence in the main trips table.

- [x] Make broker take-back independent of the trip record existing in the main trips table.
  - _Added 2026-09-15_
- [x] Confirm the fix is released and deployed on the IMB environments; test unroute then take-back on staging.
- [x] Move the ticket to Fixed/Resolved with the release reference (still shows Assigned).

## Week 2026-09-07 → 2026-09-13

### 8. [x] SDHS - send face card when its expiry is not set

Status: **done** · Added 2026-09-09 · Updated 2026-09-09 · Completed 2026-09-09

- [x] On SD Login in SDHS Service, if face card expiry is not set (blank / 1900) then still send this face card no, as it is not expired. Change done in sp usp_SDGetAllDrivers.

### 9. [x] #IMB-TK-20 - Trips stuck on the broker's screen after being moved to a different provider

Status: **done** · Added 2026-09-10 · Updated 2026-09-10 · Completed 2026-09-10

- [x] Two trips for rider Robert Fall (booked by the SanFran broker for Friday 09-05) were first handed to provider TransMetro. The broker then pulled them back and, the next day, handed them instead to Centurion Medical Transport.
- [x] The pull-back from TransMetro was only half completed. Our system cancelled the trips at TransMetro correctly, but never recorded on its own side that the cancellation was done - so it kept thinking a cancellation was still pending with TransMetro.
- [x] Because of that unfinished bookkeeping, the system refused to send the trips onward to Centurion.

### 19. [x] #SR-TK-40 - SDHS: send face card on login even when its expiry is not set

Status: **done** · Priority: **high** · Added 2026-10-20 · Updated 2026-09-09 · Completed 2026-09-09

Link: [SR-TK-40](https://track.itcurves.us/?view=ticket_details&ticketId=SR-TK-40)

_Notes:_ Created by Ihtesham Hussain on 9 Sep 2026 (Silver Ride). Track: Fixed, Urgent. Start 9/9/2026, due 9/18/2026, no expected date. Ticket: on SD login in the SDHS service, if face card expiry is not set (blank / 1900), still send the face card no, as it is not expired. Change done in sp usp_SDGetAllDrivers. Note (9 Sep): only done for the primary face card.

- [x] Send the face card no when expiry is blank/1900 (usp_SDGetAllDrivers), for the primary face card.
  - _Added 2026-09-09_
- [x] Confirm the SP change is in the SilverRide release package and deployed; verify a driver with no face card expiry gets it on login.
- [x] Decide whether secondary face cards need the same rule, then resolve the ticket.

### 20. [x] #SR-TK-34 - Error when adjusting times in west coast SF Bay Area

Status: **done** · Priority: **high** · Added 2026-10-20 · Updated 2026-09-10 · Completed 2026-09-10

Link: [SR-TK-34](https://track.itcurves.us/?view=ticket_details&ticketId=SR-TK-34)

_Notes:_ Created by Dhurin Vahia on 1 Sep 2026 (Silver Ride). Track: Fixed, Urgent. Start 9/1/2026, due 9/10/2026, no expected date. Ticket: "See screenshot from dispatcher Jessice" (4 attachments). Note (10 Sep): issue was fixed and requires a new release to deploy; the URL could not be deduced from the screenshot, so not sure where the release deployment is needed.

- [x] Fix the error when adjusting times.
  - _Added 2026-09-10_
- [x] Ask Dhurin / dispatcher Jessica which URL/environment they use (West Coast SF Bay Area) and deploy the fixed release there via Hassam.
- [x] Have the dispatcher retest adjusting times, then resolve the ticket.

## Week 2026-08-31 → 2026-09-06

### 1. [x] Web MRMS Security - support fixes

Status: **done** · Added 2026-09-01 · Updated 2026-09-01 · Completed 2026-09-01

_Notes:_ Fixes were done in the central class.

- [x] Export not working from Processing Center.
- [x] FS were not filtering on affiliate change.
- [x] Investigated frequent sign out and app crashes.

### 2. [x] Bigger RefID value needs BIGINT - stored procedure errors

Status: **done** · Added 2026-09-01 · Updated 2026-09-01 · Completed 2026-09-01

- [x] Dispatch grid was not showing data (SP fixed).
- [x] BOARA Trips were not moving (SP fixed).

### 3. [x] CAT setup Fare = 0 for Route 7 Fare Zones (#CAT-TK-74)

Status: **done** · Added 2026-09-02 · Updated 2026-09-02 · Completed 2026-09-02

- [x] Imported the fare zones into CAT production from excel file.
- [x] Done Fare = 0 setup by creating Fare attributes and their combinations.

### 4. [x] Fare Zone screen not opening - drawing library error

Status: **done** · Added 2026-09-02 · Updated 2026-09-02 · Completed 2026-09-02

- [x] Fare zone screen was giving a drawing library error and it was not opening. Currently just fixed this screen by increasing the version. Permanent fix will be done later.

### 5. [x] usp_GetNUpdateAffiliateServiceHours - ambiguous dtModified

Status: **done** · Added 2026-09-03 · Updated 2026-09-03 · Completed 2026-09-03

- [x] dtModified was added to Interest Points, causing it to become ambiguous in the sp usp_GetNUpdateAffiliateServiceHours. Fixed by applying alias.

### 6. [x] Duplicate Access Trips in Outload

Status: **done** · Added 2026-09-03 · Updated 2026-09-03 · Completed 2026-09-03

- [x] Investigated via stats and found that they were getting duplicated in Inload. Fix applied on the Inload side with Umar.

### 7. [x] OL - prevent duplicate trip insertion by JobID for Access TSPs

Status: **done** · Added 2026-09-04 · Updated 2026-09-04 · Completed 2026-09-04

- [x] Implemented the protection on OL to prevent duplicate trips insertion by JobID, only for Access TSPs. An Access TSP trip can be duplicate by inload confirmation no, so it has to be checked by JobID.

### 8. [x] STS - zones and service hours setup for FS = SSTAP

Status: **done** · Added 2026-09-04 · Updated 2026-09-04 · Completed 2026-09-04

- [x] Helped in setting up zones / service hours in STS for FS = SSTAP in meeting.

### 9. [x] Zone Management

Status: **done** · Priority: **high** · Added 2026-08-11 · Updated 2026-09-04 · Completed 2026-09-04

_Notes:_ Missing and pending functionalities in the new Zone Management portal. The remaining GTFS and City/State/Zip plotting is top priority as per Iqbal sb (Aug 24).

- [x] From legacy Web MRMS, we should open new screen of Zone Management via auto login and auto redirect to it.
  - _Updated 2026-08-13 · Completed 2026-08-13_
- [x] If zone names are too many, they cut-off.
  - _Updated 2026-08-13 · Completed 2026-08-13_
- [x] Implement zone polygone plotting for City/State/Zip.
- [x] Implement the zone polygone plot by GTFS feed.
- [x] It should use common configurations of app or api.
  - _Added 2026-08-28_
- [x] Any api key or url should come from config (only if it can change server to server).
  - _Added 2026-08-28_

### 10. [x] GTA - frplanning API returning wrong affiliate data

Status: **done** · Added 2026-08-27 · Updated 2026-09-04 · Completed 2026-09-04

- [x] gtafrplanningapi.itcurves.us/ZoneManagement/GetAllActiveAffiliates is bringing wrong data. Configurations of the frplanning API to be checked.
  - _Updated 2026-08-28 · Completed 2026-08-28_
- [x] Zone Management needs a common configuration, not a separate configuration.
  - _Added 2026-08-28_

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
