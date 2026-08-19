type RouteValue = string | readonly string[] | undefined;

const firstRouteValue = (value: RouteValue): string =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? '';

export const getRequestedTrainingProgressExerciseKey = ({
  exerciseId,
  exerciseName,
}: {
  exerciseId?: RouteValue;
  exerciseName?: RouteValue;
}): string | null => {
  const id = firstRouteValue(exerciseId);
  if (id) return id;

  const name = firstRouteValue(exerciseName).toLocaleLowerCase();
  return name ? `name:${name}` : null;
};
