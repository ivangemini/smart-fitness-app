import { KnowledgeLibraryCard } from '@/features/knowledge/KnowledgeLibraryCard';
import type { CoachGoalProgressContext } from './coachGoalProgressContext';
import { CoachGoalProgressContextCard } from './CoachGoalProgressContextCard';
import { CoachQuestionCard } from './CoachQuestionCard';

export function CoachGoalProgressCard({
  context,
}: {
  context: CoachGoalProgressContext | null;
}) {
  return (
    <>
      <CoachGoalProgressContextCard context={context} />
      <CoachQuestionCard />
      <KnowledgeLibraryCard />
    </>
  );
}
