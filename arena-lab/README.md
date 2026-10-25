# Arena Lab — browser edition

Live at `https://ragingaxolotl-art.github.io/Student-tools-/arena-lab/` after Pages deployment. A buildless, dependency-free browser version of the local experiment tracker. The existing classroom tools remain in `site.zip`; Pages overlays this source directory and the shared navigation update during deployment.

## Use

Open the HTTPS site in a desktop browser. Try the synthetic demo, or connect a webcam. Enter measured floor dimensions, click four corners clockwise from top left, define two zones, and verify a known ruler span at both ends. Remove the ruler and all subjects; capture the empty reference. Add subjects, check detection, and start a trial. Download data before leaving the tab.

Camera requests 4K when available; analysis runs at up to 720 × 480 pixels, approximately 10 updates/sec. The empty reference averages eight frames. Circle zones include an entry-radius guide; rectangle borders show the base region, with the configured near distance applied numerically. Ruler validation checks floor scale, not lens distortion. A single camera measures planar centroid-to-boundary distance, not 3D position or body-edge distance.

## Experiments and data

Dish choice, rectangular-zone choice, activity, moving-object and empty-arena presets are included. Tune blob area, pixel threshold, matching speed/slack, moving-speed threshold, gap limit, near distance, exit hysteresis and minimum visit duration. Trial labels, conditions and freeform replicate/environment notes are saved. Settings can be exported/reloaded; geometry is always recalibrated. Browser profiles are separate from Python profiles.

Complete JSON includes settings, camera readback, calibration, raw observations, frames, quality indicators, exclusion intervals, events and per-track summaries. CSV buttons export observations and summary tables. Optional annotated MediaRecorder video can be downloaded separately. All processing and data stay in the current browser tab; no external libraries, analytics, uploads or server are used. The app has no persistent experiment storage. Download before closing.

An excluded interval has frame records/video but no track observations or summary contribution. Returning creates new track segments. Near dwell requires both matched endpoints to be near. Raw visits count segment entries; qualified visits require the minimum duration. Movement/rest use observed centroid speed. Track segments are not proven individual identities. Subjects can merge, disappear or swap IDs. Flags do not automatically exclude measurements. Proximity does not establish feeding or treatment preference.

Switching to another tab stops a trial to avoid hidden-tab timing artifacts. Memory limits stop at 200,000 observations, 80,000 frame records or approximately 180 MB of video; download results before beginning another trial. Video timing is browser-dependent; CSV/JSON monotonic timestamps are authoritative. These limits and prototype tracking are not suitable for unattended long-term experiments.

For repeatable trials, first record an empty control, verify ruler distances at multiple positions, measure stationary-object jitter, and compare a short subject pilot with manual counts/timing. Balance treatment sides across replicates; frames and fragmented tracks are not independent animals. Wall climbing, flight, deep water and raised objects violate planar geometry.

## Tests

`node --test arena-lab/core.test.mjs` verifies perspective mapping, zone distances, stationary detection, masks, dwell, identity ambiguity, time gaps and exports. Browser tests additionally exercise the demo, exclusions, exports and automatic stop. Physical-camera accuracy remains to be validated for each setup.
