import { n as getReefRuntime, t as getActiveReef } from "../../runtime-DDrbavBb.js";
//#region extensions/reef/src/commands.ts
async function handleReefCommand({ args }) {
  const active = getActiveReef();
  const words = (args ?? "").trim().split(/\s+/).filter(Boolean);
  if (words[0] === "friend" && words[1] === "code") {
    const minted = await active.friends.mintCode();
    return {
      text: `Reef friend code: ${minted.code} (expires ${/* @__PURE__ */ new Date(minted.expires * 1e3).toISOString()})`,
    };
  }
  if (words[0] === "friend" && words[1] === "request" && words[2]) {
    await active.friends.request(words[2].replace(/^@/, "").toLowerCase(), words[3]);
    return { text: "Reef friend request submitted." };
  }
  if (
    words[0] === "friend" &&
    words[1] === "respond" &&
    words[2] &&
    /^(accept|reject)$/.test(words[3] ?? "")
  ) {
    const peer = words[2].replace(/^@/, "").toLowerCase();
    await active.friends.transport.respondFriend(peer, words[3] === "accept");
    return { text: `Reef request ${words[3]}ed for @${peer}.` };
  }
  if (words[0] === "friend" && words[1] === "list") {
    const friends = await active.friends.list();
    return {
      text: friends.length
        ? friends
            .map(
              (friend) =>
                `@${friend.peer} ${friend.status} epoch=${friend.key_epoch} fingerprint=${friend.fingerprint} autonomy=${friend.autonomy ?? "unapproved"}`,
            )
            .join("\n")
        : "No Reef friends.",
    };
  }
  if (words[0] === "friend" && /^(remove|block)$/.test(words[1] ?? "") && words[2]) {
    const peer = words[2].replace(/^@/, "").toLowerCase();
    await active.friends.remove(peer);
    await persistFriends();
    return { text: `Reef friend @${peer} blocked and removed locally.` };
  }
  if (words[0] === "review" && words[1] === "list") {
    const reviews = await active.reviews.list();
    return {
      text: reviews.length
        ? reviews
            .map(
              (review) =>
                `${review.approvalDigest} ${review.direction} ${review.from} -> ${review.to} ${review.verdict.category}`,
            )
            .join("\n")
        : "No pending Reef reviews.",
    };
  }
  if (words[0] === "review" && /^(approve|deny)$/.test(words[1] ?? "") && words[2])
    return {
      text: (await active.reviews.decide(words[2], words[1] === "approve"))
        ? `Reef review ${words[1]}d. Retry the identical message to re-run the guard.`
        : "Unknown Reef approval digest.",
    };
  return {
    text: "Usage: /reef friend code|request <handle> [code]|respond <handle> accept|reject|list|remove <handle>; /reef review list|approve <digest>|deny <digest>",
  };
}
async function persistFriends() {
  const runtime = getReefRuntime();
  const friends = structuredClone(getActiveReef().friends.config.friends);
  await runtime.config.mutateConfigFile({
    afterWrite: { mode: "auto" },
    mutate(draft) {
      const reef = draft.channels?.reef;
      if (!reef) throw new Error("Reef config missing during friend update");
      reef.friends = friends;
    },
  });
}
//#endregion
export { handleReefCommand };
