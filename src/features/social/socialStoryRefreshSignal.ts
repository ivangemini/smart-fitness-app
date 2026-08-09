type SocialStoryRefreshListener = () => void;

const listeners = new Set<SocialStoryRefreshListener>();

export const requestSocialStoryRefresh = (): void => {
  for (const listener of listeners) listener();
};

export const subscribeSocialStoryRefresh = (
  listener: SocialStoryRefreshListener,
): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
