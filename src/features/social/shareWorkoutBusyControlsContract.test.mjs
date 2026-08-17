import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const screen = readFileSync(
  new URL("./screens/ShareWorkoutScreen.tsx", import.meta.url),
  "utf8",
);
const styles = readFileSync(
  new URL("./screens/ShareWorkoutScreen.styles.ts", import.meta.url),
  "utf8",
);
const mediaCard = readFileSync(
  new URL("./ShareWorkoutMediaCard.tsx", import.meta.url),
  "utf8",
);

describe("Share Workout busy controls source contract", () => {
  it("freezes editable controls while publishing or media is busy", () => {
    expect(screen).toContain(
      'const editingDisabled = publishState === "publishing" || mediaBusy;',
    );
    expect(screen).toContain("editable={!editingDisabled}");
    expect(screen).toContain("disabled={editingDisabled}");
    expect(screen).toContain('disabled={publishState === "publishing"}');
  });

  it("uses an explicit disabled Liquid Glass material for the caption", () => {
    expect(screen).toContain("editingDisabled && styles.captionInputDisabled");
    expect(styles).toContain("captionInputDisabled:");
    expect(styles).toContain("backgroundColor: glass.disabledFill");
    expect(styles).toContain("borderColor: glass.disabledBorder");
  });

  it("makes media actions honor the parent publishing lock", () => {
    expect(mediaCard).toContain("disabled?: boolean");
    expect(mediaCard).toContain("const controlsDisabled = busy || disabled;");
    expect(mediaCard).toContain("disabled={controlsDisabled}");
  });
});
