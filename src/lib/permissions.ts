import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  posts: ["create", "read", "update", "delete", "update:own", "delete:own", "like", "comment"],
  comments: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  USER: ac.newRole({
    posts: ["create", "read", "update:own", "delete:own", "like", "comment"],
    comments: ["create", "read", "update:own", "delete:own"],
  }),

  ADMIN: ac.newRole({
    posts: ["create", "read", "update", "delete", "update:own", "delete:own", "like", "comment"],
    comments: ["create", "read", "update", "delete", "update:own", "delete:own"],
    ...adminAc.statements,
  }),
};

export function canUserInteract(userRole?: string) {
  return userRole !== undefined;
}

export function canUserComment(userRole?: string) {
  return userRole !== undefined;
}

export function canUserLike(userRole?: string) {
  return userRole !== undefined;
}

export function canUserCreatePost() {
  return true; // Allow all users, even unauthenticated ones
}

export function canUserManageOwnContent(isOwner: boolean, userRole?: string) {
  return userRole !== undefined && isOwner;
}

export function canUserManageAllContent(userRole?: string) {
  return userRole === "ADMIN";
}

export function canUserDeleteComment(commentUserId: string | null, postUserId: string, currentUserId?: string, userRole?: string) {
  // Admins can delete any comment
  if (userRole === "ADMIN") {
    return true;
  }
  
  // Comment author can delete their own comment
  if (commentUserId && currentUserId && commentUserId === currentUserId) {
    return true;
  }
  
  // Post author can delete comments on their post
  if (currentUserId && postUserId === currentUserId) {
    return true;
  }
  
  return false;
}
