export type LocalizedExerciseText = {
  en: string;
  ru: string;
};

export type ExerciseMovementPattern =
  | 'horizontal-push'
  | 'vertical-push'
  | 'vertical-pull'
  | 'horizontal-pull'
  | 'shoulder-adduction'
  | 'elbow-flexion'
  | 'elbow-extension'
  | 'shoulder-abduction'
  | 'squat'
  | 'knee-dominant'
  | 'hinge'
  | 'plantar-flexion';

export type ExerciseFatigueCost = 'low' | 'moderate' | 'high';

export type ReviewedExerciseSubstitution = {
  exerciseId: string;
  label: LocalizedExerciseText;
  rationale: LocalizedExerciseText;
};

export type ReviewedExerciseIntelligence = {
  version: 'exercise-intelligence-v1';
  movementPattern: ExerciseMovementPattern;
  fatigueCost: ExerciseFatigueCost;
  techniqueCues: LocalizedExerciseText[];
  commonErrors: LocalizedExerciseText[];
  rangeOfMotion: LocalizedExerciseText[];
  substitutions: ReviewedExerciseSubstitution[];
};

const t = (en: string, ru: string): LocalizedExerciseText => ({ en, ru });
const sub = (exerciseId: string, en: string, ru: string, rationaleEn: string, rationaleRu: string): ReviewedExerciseSubstitution => ({
  exerciseId,
  label: t(en, ru),
  rationale: t(rationaleEn, rationaleRu),
});
const item = (
  movementPattern: ExerciseMovementPattern,
  fatigueCost: ExerciseFatigueCost,
  techniqueCues: LocalizedExerciseText[],
  commonErrors: LocalizedExerciseText[],
  rangeOfMotion: LocalizedExerciseText[],
  substitutions: ReviewedExerciseSubstitution[] = [],
): ReviewedExerciseIntelligence => ({
  version: 'exercise-intelligence-v1',
  movementPattern,
  fatigueCost,
  techniqueCues,
  commonErrors,
  rangeOfMotion,
  substitutions,
});

const CATALOG: Record<string, ReviewedExerciseIntelligence> = {
  'bench-press': item(
    'horizontal-push',
    'high',
    [t('Set the shoulder blades before unracking.', 'Сведите и зафиксируйте лопатки до снятия штанги.'), t('Keep wrists stacked over forearms.', 'Держите кисти над предплечьями.')],
    [t('Losing upper-back tension during the descent.', 'Потеря напряжения верха спины при опускании.'), t('Flaring the elbows aggressively.', 'Чрезмерное разведение локтей в стороны.')],
    [t('Lower under control to a comfortable chest touch, then press to elbow extension without losing shoulder position.', 'Опускайте штангу подконтрольно до комфортного касания груди и выжимайте до разгибания локтей, сохраняя положение плеч.')],
    [sub('push-up', 'Push-Up', 'Отжимания', 'Keeps the same horizontal-push pattern with bodyweight loading.', 'Сохраняет горизонтальный жим с нагрузкой весом тела.')],
  ),
  'incline-dumbbell-press': item(
    'horizontal-push',
    'moderate',
    [t('Use a moderate bench incline and keep the shoulders packed.', 'Используйте умеренный наклон скамьи и удерживайте плечи собранными.'), t('Press both dumbbells on the same path.', 'Ведите обе гантели по одинаковой траектории.')],
    [t('Turning the press into a steep shoulder press.', 'Слишком большой наклон, превращающий движение в жим на плечи.'), t('Dropping the elbows below a controllable shoulder position.', 'Опускание локтей ниже контролируемого положения плеча.')],
    [t('Lower until the upper arm reaches a comfortable depth, then press to controlled elbow extension.', 'Опускайте до комфортной глубины плеча и выжимайте до контролируемого разгибания локтя.')],
    [sub('bench-press', 'Bench Press', 'Жим лёжа', 'Uses the same press family with a flatter torso angle.', 'Относится к той же группе жимов, но с меньшим наклоном корпуса.')],
  ),
  'push-up': item(
    'horizontal-push',
    'low',
    [t('Brace from ribs to pelvis before each rep.', 'Перед повтором зафиксируйте корпус от рёбер до таза.'), t('Move the chest and hips as one unit.', 'Опускайте и поднимайте грудь и таз как единый блок.')],
    [t('Letting the hips sag.', 'Провисание таза.'), t('Shortening the bottom range while the shoulders remain comfortable.', 'Необоснованное сокращение нижней амплитуды при комфортных плечах.')],
    [t('Lower the chest between the hands as far as shoulder control allows, then return to a tall plank.', 'Опускайте грудь между кистями настолько, насколько позволяет контроль плеч, затем возвращайтесь в высокую планку.')],
    [sub('bench-press', 'Bench Press', 'Жим лёжа', 'Adds externally loadable horizontal pressing.', 'Даёт горизонтальный жим с удобно увеличиваемой внешней нагрузкой.')],
  ),
  'cable-fly': item(
    'shoulder-adduction',
    'low',
    [t('Keep a soft, stable elbow angle.', 'Сохраняйте небольшой стабильный сгиб в локте.'), t('Bring the upper arms across the body instead of pressing the handles.', 'Сводите плечи перед корпусом, а не выжимайте рукояти.')],
    [t('Turning the fly into an elbow-dominant press.', 'Превращение сведения в жим за счёт локтей.'), t('Using momentum through the torso.', 'Раскачивание корпуса.')],
    [t('Open until a controlled chest stretch without forcing the shoulder, then bring the arms toward the midline.', 'Разводите руки до контролируемого растяжения груди без форсирования плеча, затем сводите к средней линии.')],
    [sub('push-up', 'Push-Up', 'Отжимания', 'Trains the same chest region with a different horizontal-push pattern.', 'Нагружает ту же область груди через другой горизонтальный жимовой паттерн.')],
  ),
  'pull-up': item(
    'vertical-pull',
    'moderate',
    [t('Start from a controlled hang with the ribs stacked.', 'Начинайте из контролируемого виса, удерживая рёбра собранными.'), t('Drive the elbows down instead of reaching the chin forward.', 'Тяните локти вниз, а не вытягивайте подбородок вперёд.')],
    [t('Kipping when the goal is a strict rep.', 'Раскачка при цели выполнить строгий повтор.'), t('Shrugging and losing control at the bottom.', 'Подъём плеч и потеря контроля внизу.')],
    [t('Use a controlled hang to the highest pull you can complete without changing body position.', 'Работайте от контролируемого виса до максимальной высоты тяги без изменения положения корпуса.')],
    [sub('lat-pulldown', 'Lat Pulldown', 'Тяга верхнего блока', 'Keeps a vertical-pull pattern with easier load scaling.', 'Сохраняет вертикальную тягу с более удобной регулировкой нагрузки.')],
  ),
  'lat-pulldown': item(
    'vertical-pull',
    'moderate',
    [t('Keep the torso quiet and pull the elbows toward the ribs.', 'Держите корпус стабильным и ведите локти к рёбрам.'), t('Control the return instead of letting the stack pull you up.', 'Контролируйте возврат, не позволяя блоку резко тянуть вас вверх.')],
    [t('Leaning far back to turn it into a row.', 'Сильный наклон назад, превращающий движение в горизонтальную тягу.'), t('Shrugging at the top.', 'Подъём плеч в верхней точке.')],
    [t('Reach overhead under control, then pull until the elbows reach a strong, comfortable bottom position.', 'Поднимайте руки вверх подконтрольно и тяните до сильного комфортного нижнего положения локтей.')],
    [sub('pull-up', 'Pull-Up', 'Подтягивания', 'Uses the same vertical-pull family with bodyweight resistance.', 'Сохраняет вертикальную тягу с сопротивлением весом тела.')],
  ),
  'barbell-row': item(
    'horizontal-pull',
    'high',
    [t('Set the hip hinge and brace before rowing.', 'Зафиксируйте тазобедренный наклон и корпус до начала тяги.'), t('Pull toward the lower ribs while keeping the bar close.', 'Тяните к нижним рёбрам, удерживая штангу близко к телу.')],
    [t('Changing torso angle on every rep.', 'Изменение угла корпуса на каждом повторе.'), t('Shrugging instead of driving the elbows back.', 'Шраг вместо движения локтей назад.')],
    [t('Reach the arms long without losing the hinge, then row until the elbows pass the torso as control allows.', 'Выпрямляйте руки без потери наклона и тяните до прохождения локтей за корпус в пределах контроля.')],
    [sub('lat-pulldown', 'Lat Pulldown', 'Тяга верхнего блока', 'Reduces unsupported torso demand while keeping a back-focused pull.', 'Снижает требования к удержанию корпуса, сохраняя тяговую нагрузку на спину.')],
  ),
  'dumbbell-curl': item(
    'elbow-flexion',
    'low',
    [t('Keep the upper arm quiet beside the torso.', 'Удерживайте плечо неподвижно рядом с корпусом.'), t('Control the lowering phase.', 'Контролируйте опускание гантели.')],
    [t('Swinging the torso to start the rep.', 'Раскачивание корпуса для начала повтора.'), t('Letting the elbows drift far forward.', 'Сильный уход локтей вперёд.')],
    [t('Curl from near-straight elbows to the highest position you can reach without moving the upper arm.', 'Сгибайте от почти прямого локтя до максимально высокой позиции без движения плеча.')],
  ),
  'triceps-pushdown': item(
    'elbow-extension',
    'low',
    [t('Pin the elbows near the sides.', 'Удерживайте локти рядом с корпусом.'), t('Finish by extending the elbows, not by leaning over the handle.', 'Завершайте повтор разгибанием локтей, а не наклоном корпуса.')],
    [t('Letting the elbows travel forward on the return.', 'Уход локтей вперёд при возврате.'), t('Using bodyweight to move the stack.', 'Использование веса корпуса для движения блока.')],
    [t('Allow controlled elbow flexion at the top, then extend to a strong lockout without forcing the joint.', 'Допускайте контролируемое сгибание локтя наверху и разгибайте до сильной позиции без форсирования сустава.')],
  ),
  'overhead-press': item(
    'vertical-push',
    'high',
    [t('Brace before the bar leaves the shoulders.', 'Зафиксируйте корпус до начала жима.'), t('Move the head through after the bar clears it.', 'После прохождения штанги проведите голову вперёд под гриф.')],
    [t('Overarching the lower back to finish the rep.', 'Чрезмерный прогиб поясницы для завершения повтора.'), t('Pressing around the face instead of keeping a compact bar path.', 'Обвод штанги вокруг лица вместо компактной траектории.')],
    [t('Press from the upper chest to overhead elbow extension while keeping ribs and pelvis controlled.', 'Жмите от верхней части груди до разгибания рук над головой, сохраняя контроль рёбер и таза.')],
    [sub('incline-dumbbell-press', 'Incline Dumbbell Press', 'Жим гантелей на наклонной', 'Keeps a press emphasis while reducing the fully overhead demand.', 'Сохраняет жимовой акцент при меньшей потребности работать строго над головой.')],
  ),
  'lateral-raise': item(
    'shoulder-abduction',
    'low',
    [t('Lead with the elbows and keep the torso quiet.', 'Ведите движение локтями и не раскачивайте корпус.'), t('Use a load that preserves a smooth arc.', 'Используйте вес, позволяющий сохранять плавную дугу.')],
    [t('Shrugging the weight up.', 'Подъём веса за счёт шрага.'), t('Using a large torso swing.', 'Сильная раскачка корпуса.')],
    [t('Raise through a comfortable arc toward shoulder height, then lower under control.', 'Поднимайте руки по комфортной дуге примерно до уровня плеч и опускайте подконтрольно.')],
  ),
  'squat': item(
    'squat',
    'high',
    [t('Brace before descending and keep the bar over mid-foot.', 'Зафиксируйте корпус до спуска и удерживайте штангу над серединой стопы.'), t('Let the knees track in the same direction as the toes.', 'Ведите колени в направлении носков.')],
    [t('Losing foot pressure and balance.', 'Потеря давления стопы и равновесия.'), t('Forcing depth after the pelvis or spine loses control.', 'Форсирование глубины после потери контроля таза или позвоночника.')],
    [t('Descend to the deepest position you can control while maintaining balance, then stand without shifting off mid-foot.', 'Опускайтесь до максимальной контролируемой глубины с сохранением равновесия и вставайте без смещения с середины стопы.')],
    [sub('leg-press', 'Leg Press', 'Жим ногами', 'Keeps a knee-dominant leg pattern with more external support.', 'Сохраняет коленно-доминантную нагрузку на ноги при большей внешней опоре.')],
  ),
  'leg-press': item(
    'knee-dominant',
    'moderate',
    [t('Keep the hips and back supported by the pad.', 'Удерживайте таз и спину прижатыми к опоре.'), t('Track knees with the feet through the press.', 'Ведите колени в направлении стоп на всём повторе.')],
    [t('Lowering until the pelvis rolls away from the pad.', 'Опускание платформы до отрыва таза от спинки.'), t('Hard knee locking at the top.', 'Жёсткое переразгибание коленей наверху.')],
    [t('Lower only as far as the pelvis stays controlled against the pad, then press back without forced lockout.', 'Опускайте платформу только пока таз остаётся контролируемым у спинки, затем выжимайте без форсированного переразгибания.')],
    [sub('squat', 'Squat', 'Присед', 'Uses a free-weight squat pattern with greater whole-body stabilization demand.', 'Даёт свободный присед с большей потребностью в стабилизации всего тела.')],
  ),
  'romanian-deadlift': item(
    'hinge',
    'high',
    [t('Push the hips back while keeping the bar close.', 'Отводите таз назад, удерживая штангу близко к ногам.'), t('Keep the knees softly bent rather than turning it into a squat.', 'Сохраняйте небольшой сгиб коленей, не превращая движение в присед.')],
    [t('Reaching the bar lower by rounding the back.', 'Опускание штанги ниже за счёт округления спины.'), t('Letting the bar drift away from the legs.', 'Уход штанги далеко от ног.')],
    [t('Hinge until hamstring tension or trunk control limits further descent, then extend the hips to stand tall.', 'Наклоняйтесь до ограничения натяжением задней поверхности бедра или контролем корпуса, затем разгибайте таз до стойки.')],
    [sub('leg-press', 'Leg Press', 'Жим ногами', 'Provides a supported leg exercise when a loaded hip hinge is not desired.', 'Даёт упражнение для ног с опорой, когда нагруженный тазобедренный наклон нежелателен.')],
  ),
  'calf-raise': item(
    'plantar-flexion',
    'low',
    [t('Keep pressure through the ball of the foot.', 'Сохраняйте давление через переднюю часть стопы.'), t('Pause briefly near the top instead of bouncing.', 'Коротко фиксируйтесь наверху вместо пружинящих повторов.')],
    [t('Bouncing out of the stretched position.', 'Отбив из растянутой нижней позиции.'), t('Rolling the ankle outward or inward under load.', 'Завал стопы наружу или внутрь под нагрузкой.')],
    [t('Lower into a controlled calf stretch, then rise as high as you can without losing foot alignment.', 'Опускайтесь до контролируемого растяжения икры и поднимайтесь максимально высоко без потери положения стопы.')],
  ),
};

const cloneText = (value: LocalizedExerciseText): LocalizedExerciseText => ({ ...value });
const cloneIntelligence = (value: ReviewedExerciseIntelligence): ReviewedExerciseIntelligence => ({
  ...value,
  techniqueCues: value.techniqueCues.map(cloneText),
  commonErrors: value.commonErrors.map(cloneText),
  rangeOfMotion: value.rangeOfMotion.map(cloneText),
  substitutions: value.substitutions.map((entry) => ({
    ...entry,
    label: cloneText(entry.label),
    rationale: cloneText(entry.rationale),
  })),
});

export function getReviewedExerciseIntelligence(exerciseId: string) {
  const value = CATALOG[exerciseId];
  return value ? cloneIntelligence(value) : null;
}

export function getReviewedExerciseIntelligenceIds() {
  return Object.keys(CATALOG);
}

export function selectExerciseIntelligenceText(value: LocalizedExerciseText, locale: string) {
  return locale.toLowerCase().startsWith('ru') ? value.ru : value.en;
}
