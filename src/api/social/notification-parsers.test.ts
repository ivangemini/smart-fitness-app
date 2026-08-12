import { describe, expect, it } from 'vitest';

import {
  parseSocialNotificationDto,
  parseSocialNotificationPageResponse,
  parseSocialNotificationResponse,
} from './notification-parsers';

const actor = {
  schemaVersion: 1,
  username: 'coach_ivan',
  displayName: 'Ivan',
  bio: null,
  avatarUrl: null,
  visibility: 'public',
  createdAt: '2026-07-31T08:00:00.000Z',
  updatedAt: '2026-07-31T08:00:00.000Z',
};

const followRequest = {
  schemaVersion: 1,
  id: '00000000-0000-4000-8000-000000000201',
  type: 'follow_request',
  actor,
  postId: null,
  commentId: null,
  storyId: null,
  readAt: null,
  createdAt: '2026-07-31T10:00:00.000Z',
};

const reaction = {
  ...followRequest,
  id: '00000000-0000-4000-8000-000000000202',
  type: 'workout_reaction',
  postId: '00000000-0000-4000-8000-000000000101',
  readAt: '2026-07-31T10:05:00.000Z',
};

const comment = {
  ...followRequest,
  id: '00000000-0000-4000-8000-000000000203',
  type: 'workout_comment',
  postId: '00000000-0000-4000-8000-000000000101',
  commentId: '00000000-0000-4000-8000-000000000102',
};

const storyLike = {
  ...followRequest,
  id: '00000000-0000-4000-8000-000000000204',
  type: 'story_like',
  storyId: '00000000-0000-4000-8000-000000000301',
};

const storyReaction = {
  ...storyLike,
  id: '00000000-0000-4000-8000-000000000205',
  type: 'story_reaction',
};

const storyReply = {
  ...storyLike,
  id: '00000000-0000-4000-8000-000000000206',
  type: 'story_reply',
};

describe('social notification parsers', () => {
  it('parses strict notification, envelope, and page responses', () => {
    expect(parseSocialNotificationDto(followRequest)).toEqual(followRequest);
    expect(parseSocialNotificationDto(reaction)).toEqual(reaction);
    expect(parseSocialNotificationDto(comment)).toEqual(comment);
    expect(parseSocialNotificationDto(storyLike)).toEqual(storyLike);
    expect(parseSocialNotificationDto(storyReaction)).toEqual(storyReaction);
    expect(parseSocialNotificationDto(storyReply)).toEqual(storyReply);
    expect(parseSocialNotificationResponse({ notification: reaction })).toEqual(
      reaction,
    );
    expect(
      parseSocialNotificationPageResponse({
        schemaVersion: 1,
        items: [reaction, comment, storyLike, storyReaction, storyReply],
        nextCursor: 'next-notification-page',
      }),
    ).toEqual({
      schemaVersion: 1,
      items: [reaction, comment, storyLike, storyReaction, storyReply],
      nextCursor: 'next-notification-page',
    });
  });

  it('normalizes the legacy pre-S9-F notification shape for mobile-first rollout', () => {
    const { storyId: _storyId, ...legacyReaction } = reaction;
    expect(parseSocialNotificationDto(legacyReaction)).toEqual(reaction);
  });

  it.each([
    { ...followRequest, schemaVersion: 2 },
    { ...followRequest, id: 'not-a-uuid' },
    { ...followRequest, type: 'unknown' },
    { ...followRequest, postId: reaction.postId },
    { ...followRequest, storyId: storyLike.storyId },
    { ...reaction, postId: null },
    { ...reaction, commentId: comment.commentId },
    { ...reaction, storyId: storyLike.storyId },
    { ...comment, commentId: null },
    { ...storyLike, storyId: null },
    { ...storyLike, postId: reaction.postId },
    { ...storyReaction, commentId: comment.commentId },
    { ...storyReply, postId: reaction.postId },
    (() => {
      const { storyId: _storyId, ...storyWithoutTarget } = storyLike;
      return storyWithoutTarget;
    })(),
    { ...followRequest, readAt: 'invalid-date' },
    { ...followRequest, createdAt: 'invalid-date' },
    { ...followRequest, email: 'private@example.com' },
    { ...followRequest, actor: { ...actor, email: 'private@example.com' } },
  ])('rejects malformed, expanded, or shape-invalid notifications', (value) => {
    expect(() => parseSocialNotificationDto(value)).toThrow(
      'Invalid social notification response',
    );
  });

  it('rejects expanded envelopes, duplicate IDs, oversized pages, and invalid cursors', () => {
    expect(() =>
      parseSocialNotificationResponse({ notification: followRequest, extra: true }),
    ).toThrow('Invalid social notification response');
    expect(() =>
      parseSocialNotificationPageResponse({
        schemaVersion: 1,
        items: [followRequest, followRequest],
        nextCursor: null,
      }),
    ).toThrow('Invalid social notification page response');
    expect(() =>
      parseSocialNotificationPageResponse({
        schemaVersion: 1,
        items: Array.from({ length: 51 }, (_, index) => ({
          ...followRequest,
          id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
        })),
        nextCursor: null,
      }),
    ).toThrow('Invalid social notification page response');
    expect(() =>
      parseSocialNotificationPageResponse({
        schemaVersion: 1,
        items: [],
        nextCursor: '',
      }),
    ).toThrow('Invalid social notification page response');
  });
});
