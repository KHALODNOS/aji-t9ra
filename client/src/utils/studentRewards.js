export const publishStudentRewards = ({ xpAwarded = 0, totalXp = null, earnedBadges = [], reason = "" } = {}) => {
  const xp = Number(xpAwarded) || 0;

  if (xp > 0) {
    const reward = {
      xpAwarded: xp,
      totalXp,
      reason,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("newlyEarnedXp", JSON.stringify(reward));
    window.dispatchEvent(new CustomEvent("studentXpReward", { detail: reward }));
  }

  if (Array.isArray(earnedBadges) && earnedBadges.length > 0) {
    localStorage.setItem("newlyEarnedBadges", JSON.stringify(earnedBadges));
    window.dispatchEvent(new Event("newlyEarnedBadges"));
  }
};
