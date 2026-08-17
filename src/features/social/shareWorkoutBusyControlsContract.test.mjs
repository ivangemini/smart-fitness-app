import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const screen = fs.readFileSync(
  new URL("./screens/ShareWorkoutScreen.tsx", import.meta.url),
  "utf8",
);
const styles = fs.readFileSync(
  new URL("./screens/ShareWorkoutScreen.styles.ts", import.meta.url),
  "utf8",
);
const mediaCard = fs.readFileSync(
  new URL("./ShareWorkoutMediaCard.tsx", import.meta.url),
  "utf8",
);

test("share workout freezes editable controls while publishing or media is busy", () => {
  assert.match(
    screen,
    /const editingDisabled = publishState === "publishing" \|\| mediaBusy;/,
  );
  assert.match(screen, /editable=!\{?editingDisabled\}?/);
  assert.match(screen, /disabled=\{editingDisabled\}/);
  assert.match(screen, /disabled=\{publishState === "publishing"\}/);
});

test("share workout caption uses an explicit disabled Liquid Glass material", () => {
  assert.match(screen, /editingDisabled && styles\.captionInputDisabled/);
  assert.match(styles, /captionInputDisabled:/);
  assert.match(styles, /backgroundColor: glass\.disabledFill/);
  assert.match(styles, /borderColor: glass\.disabledBorder/);
});

test("share workout media actions honor the parent publishing lock", () => {
  assert.match(mediaCard, /disabled\?: boolean/);
  assert.match(mediaCard, /const controlsDisabled = busy \|\| disabled;/);
  assert.match(mediaCard, /disabled=\{controlsDisabled\}/);
});
