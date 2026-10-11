import { mapCommentRow, mapMedia, mapPostRow } from '@/services/communityService';

// babel-jest akan mengangkat `jest.mock` ke atas import, jadi urutannya aman.
jest.mock('@/config/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: {},
}));

describe('mapPostRow', () => {
  const row = {
    id: 'post-1',
    author_id: 'user-1',
    category: 'ReactJS',
    title: 'Judul',
    content: 'Isi',
    code: null,
    accent_color: '#4648d4',
    created_at: '2026-10-08T10:00:00.000Z',
    author: { id: 'user-1', username: 'mia', full_name: 'Mia', avatar_url: null },
    // PostgREST mengembalikan count sebagai string di dalam array.
    comments: [{ count: '3' }],
    post_likes: [{ count: 12 }],
  };

  it('maps a post row with counts and author', () => {
    const post = mapPostRow(row);

    expect(post.id).toBe('post-1');
    expect(post.author.username).toBe('mia');
    expect(post.commentsCount).toBe(3);
    expect(post.likesCount).toBe(12);
    expect(post.likedByMe).toBe(false);
    expect(post.code).toBeNull();
  });

  it('marks the post as liked when the user id is in the set', () => {
    expect(mapPostRow(row, new Set(['post-1'])).likedByMe).toBe(true);
    expect(mapPostRow(row, new Set(['post-2'])).likedByMe).toBe(false);
  });

  it('survives missing author and missing aggregates', () => {
    const post = mapPostRow({ id: 'p', post_likes: null, comments: null });

    expect(post.likesCount).toBe(0);
    expect(post.commentsCount).toBe(0);
    expect(post.author.username).toBe('Pengguna');
    expect(post.category).toBe('Umum');
    expect(post.media).toBeNull();
  });

  it('maps a photo or video attachment', () => {
    expect(
      mapPostRow({ ...row, media_url: 'https://x/a.jpg', media_type: 'image' }).media,
    ).toEqual({ type: 'image', url: 'https://x/a.jpg' });
    expect(
      mapPostRow({ ...row, media_url: 'https://x/clip.mp4', media_type: 'video' }).media,
    ).toEqual({ type: 'video', url: 'https://x/clip.mp4' });
  });
});

describe('mapMedia', () => {
  it('rejects unknown media types so the feed never renders a broken player', () => {
    expect(mapMedia('https://x/a.jpg', 'gif')).toBeNull();
    expect(mapMedia('https://x/a.jpg', null)).toBeNull();
  });

  it('rejects a missing url', () => {
    expect(mapMedia(null, 'image')).toBeNull();
    expect(mapMedia('', 'video')).toBeNull();
    expect(mapMedia(undefined, 'video')).toBeNull();
  });
});

describe('mapCommentRow', () => {
  it('maps a comment row with its author', () => {
    const comment = mapCommentRow({
      id: 'c-1',
      post_id: 'post-1',
      author_id: 'user-2',
      content: 'Mantap',
      created_at: '2026-10-08T11:00:00.000Z',
      author: { id: 'user-2', username: 'alex', full_name: null, avatar_url: 'https://a/b.png' },
    });

    expect(comment.id).toBe('c-1');
    expect(comment.postId).toBe('post-1');
    expect(comment.content).toBe('Mantap');
    expect(comment.author.username).toBe('alex');
    expect(comment.author.avatarUrl).toBe('https://a/b.png');
    expect(comment.media).toBeNull();
    expect(comment.parentCommentId).toBeNull();
  });

  it('maps a reply that carries a video attachment', () => {
    const reply = mapCommentRow({
      id: 'c-2',
      post_id: 'post-1',
      author_id: 'user-3',
      content: 'Setuju!',
      created_at: '2026-10-08T12:00:00.000Z',
      parent_comment_id: 'c-1',
      media_url: 'https://x/clip.mp4',
      media_type: 'video',
      author: { id: 'user-3', username: 'rian', full_name: null, avatar_url: null },
    });

    expect(reply.parentCommentId).toBe('c-1');
    expect(reply.media).toEqual({ type: 'video', url: 'https://x/clip.mp4' });
  });
});
