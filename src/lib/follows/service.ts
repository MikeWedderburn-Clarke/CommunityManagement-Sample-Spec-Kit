import { db } from "@/lib/db/client";
import { isBlocked } from "@/lib/safety/blocks";
import { getRelationship } from "@/lib/follows/relationship";
import type { FollowEntry, Relationship } from "@/types/community";

export async function follow(
  followerId: string,
  followeeId: string,
): Promise<{ followed: boolean; becameFriends: boolean }> {
  if (followerId === followeeId) {
    throw new Error("Cannot follow yourself");
  }

  const blocked = await isBlocked(followerId, followeeId);
  if (blocked) {
    throw new Error("Cannot follow a blocked user");
  }

  const already = await db().query(
    `SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2`,
    [followerId, followeeId],
  );
  if (already.rows.length > 0) {
    return { followed: false, becameFriends: false };
  }

  await db().query(
    `INSERT INTO follows (follower_id, followee_id) VALUES ($1, $2)`,
    [followerId, followeeId],
  );

  // Check if now mutual
  const reverse = await db().query(
    `SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2`,
    [followeeId, followerId],
  );

  return { followed: true, becameFriends: reverse.rows.length > 0 };
}

export async function unfollow(followerId: string, followeeId: string): Promise<boolean> {
  const exists = await db().query(
    `SELECT 1 FROM follows WHERE follower_id = $1 AND followee_id = $2`,
    [followerId, followeeId],
  );
  if (exists.rows.length === 0) return false;

  await db().query(
    `DELETE FROM follows WHERE follower_id = $1 AND followee_id = $2`,
    [followerId, followeeId],
  );
  return true;
}

export async function getFollowers(
  userId: string,
  viewerId: string | null,
  page = 1,
  pageSize = 20,
): Promise<{ entries: FollowEntry[]; total: number }> {
  const countResult = await db().query<{ cnt: string }>(
    `SELECT COUNT(*) as cnt FROM follows WHERE followee_id = $1`,
    [userId],
  );
  const total = parseInt(countResult.rows[0].cnt, 10);

  const offset = (page - 1) * pageSize;
  const result = await db().query<{
    follower_id: string;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
  }>(
    `SELECT f.follower_id, up.display_name, up.avatar_url, f.created_at
     FROM follows f
     LEFT JOIN user_profiles up ON up.user_id = f.follower_id
     WHERE f.followee_id = $1
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, pageSize, offset],
  );

  const entries: FollowEntry[] = [];
  for (const r of result.rows) {
    const relationship = await getRelationship(viewerId, r.follower_id);
    entries.push({
      userId: r.follower_id,
      displayName: r.display_name,
      avatarUrl: r.avatar_url,
      relationship,
      followedAt: r.created_at,
    });
  }

  return { entries, total };
}

export async function getFollowing(
  userId: string,
  viewerId: string | null,
  page = 1,
  pageSize = 20,
): Promise<{ entries: FollowEntry[]; total: number }> {
  const countResult = await db().query<{ cnt: string }>(
    `SELECT COUNT(*) as cnt FROM follows WHERE follower_id = $1`,
    [userId],
  );
  const total = parseInt(countResult.rows[0].cnt, 10);

  const offset = (page - 1) * pageSize;
  const result = await db().query<{
    followee_id: string;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
  }>(
    `SELECT f.followee_id, up.display_name, up.avatar_url, f.created_at
     FROM follows f
     LEFT JOIN user_profiles up ON up.user_id = f.followee_id
     WHERE f.follower_id = $1
     ORDER BY f.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, pageSize, offset],
  );

  const entries: FollowEntry[] = [];
  for (const r of result.rows) {
    const relationship = await getRelationship(viewerId, r.followee_id);
    entries.push({
      userId: r.followee_id,
      displayName: r.display_name,
      avatarUrl: r.avatar_url,
      relationship,
      followedAt: r.created_at,
    });
  }

  return { entries, total };
}

export async function getFriends(
  userId: string,
  page = 1,
  pageSize = 20,
): Promise<{ entries: FollowEntry[]; total: number }> {
  const countResult = await db().query<{ cnt: string }>(
    `SELECT COUNT(*) as cnt FROM follows f1
     INNER JOIN follows f2 ON f1.follower_id = f2.followee_id AND f1.followee_id = f2.follower_id
     WHERE f1.follower_id = $1`,
    [userId],
  );
  const total = parseInt(countResult.rows[0].cnt, 10);

  const offset = (page - 1) * pageSize;
  const result = await db().query<{
    friend_id: string;
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
  }>(
    `SELECT f1.followee_id as friend_id, up.display_name, up.avatar_url, f1.created_at
     FROM follows f1
     INNER JOIN follows f2 ON f1.follower_id = f2.followee_id AND f1.followee_id = f2.follower_id
     LEFT JOIN user_profiles up ON up.user_id = f1.followee_id
     WHERE f1.follower_id = $1
     ORDER BY f1.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, pageSize, offset],
  );

  return {
    entries: result.rows.map((r) => ({
      userId: r.friend_id,
      displayName: r.display_name,
      avatarUrl: r.avatar_url,
      relationship: "friend" as Relationship,
      followedAt: r.created_at,
    })),
    total,
  };
}
