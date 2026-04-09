export const generateConversationId = (
  userA: string,
  userB: string
) => {
  return [userA, userB].sort().join("_");
};