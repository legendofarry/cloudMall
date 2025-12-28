// src/firebase/firestore.js
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  increment,
} from "firebase/firestore";
import { app } from "./firebaseConfig";

export const db = getFirestore(app);

// ============================================
// CONTENT MODERATION UTILITIES
// ============================================

// Basic content filter for kids safety
export function moderateText(text) {
  const inappropriatePatterns = [
    /violence/i,
    /hate/i,
    /abuse/i,
    /explicit/i,
    // Add comprehensive list in production
  ];

  for (const pattern of inappropriatePatterns) {
    if (pattern.test(text)) {
      throw new Error(
        "Content contains inappropriate material. Please use kid-friendly language!"
      );
    }
  }

  return true;
}

// ============================================
// USER MANAGEMENT
// ============================================

// Create user profile at signup
export async function createUserProfile(uid, data) {
  // Moderate username if present
  if (data.username) {
    moderateText(data.username);
  }

  // Ensure areaId exists when location is provided
  const payload = { ...data };

  if (
    !payload.areaId &&
    payload.location &&
    typeof payload.location.lat === "number" &&
    typeof payload.location.lng === "number"
  ) {
    payload.areaId = `${Math.floor(payload.location.lat * 100)}_${Math.floor(
      payload.location.lng * 100
    )}`;
  }

  // Ensure avatarId exists (nullable) and onboardingComplete flag
  if (typeof payload.avatarId === "undefined") {
    payload.avatarId = null;
  }

  if (typeof payload.onboardingComplete === "undefined") {
    payload.onboardingComplete = false;
  }

  await setDoc(doc(db, "users", uid), {
    ...payload,
    createdAt: payload.createdAt ?? new Date(),
    moderated: true,
    moderatedAt: new Date(),
  });
}

// Update user location
export async function updateUserLocation(uid, location) {
  await updateDoc(doc(db, "users", uid), {
    location: location,
    areaId: `${Math.floor(location.lat * 100)}_${Math.floor(
      location.lng * 100
    )}`,
    locationUpdatedAt: new Date(),
  });
}

// Mark onboarding as complete and save parent supervision info (now stores governmentId)
export async function completeOnboarding(
  uid,
  {
    parentName = "",
    parentContact = "",
    parentNearby = true,
    governmentId = "",
  }
) {
  // Basic validation - in addition to client validation
  if (!parentNearby) {
    throw new Error("Parent supervision must be confirmed.");
  }
  if (!parentName || !parentContact || !governmentId) {
    throw new Error("Parent name, contact and government ID are required.");
  }

  await updateDoc(doc(db, "users", uid), {
    onboardingComplete: true,
    onboarding: {
      parentName,
      parentContact,
      parentNearby,
      governmentId,
      completedAt: new Date(),
    },
    lastActive: new Date(),
  });
}

// Update user activity score
export async function updateActivityScore(uid, points = 1) {
  await updateDoc(doc(db, "users", uid), {
    activityScore: increment(points),
    lastActive: new Date(),
  });
}

// Get nearby users
export async function getNearbyUsers(areaId, limitCount = 20) {
  const q = query(
    collection(db, "users"),
    where("areaId", "==", areaId),
    where("isActive", "==", true),
    orderBy("activityScore", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// ============================================
// GROUPS MANAGEMENT
// ============================================

// Create a group (requires activity check)
export async function createGroup(userId, groupData) {
  // Moderate group name and description
  moderateText(groupData.name);
  if (groupData.description) {
    moderateText(groupData.description);
  }

  // Check user activity score
  const userDoc = await getDoc(doc(db, "users", userId));
  const userData = userDoc.data();

  if (!userData || userData.activityScore < 50) {
    throw new Error(
      "You need more activity to create a group. Keep engaging with the community!"
    );
  }

  const groupRef = doc(collection(db, "groups"));
  await setDoc(groupRef, {
    ...groupData,
    ownerId: userId,
    createdAt: new Date(),
    members: [userId],
    memberCount: 1,
    verified: false,
    verificationPending: false,
    moderated: true,
    moderatedAt: new Date(),
  });

  return groupRef.id;
}

// Get nearby groups
export async function getNearbyGroups(areaId, limitCount = 20) {
  const q = query(
    collection(db, "groups"),
    where("areaId", "==", areaId),
    orderBy("memberCount", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// Apply for verified badge
export async function applyForVerification(groupId, userId) {
  const groupDoc = await getDoc(doc(db, "groups", groupId));
  const groupData = groupDoc.data();

  if (!groupData || groupData.ownerId !== userId) {
    throw new Error("Only the group owner can apply for verification");
  }

  if (groupData.verified) {
    throw new Error("Group is already verified");
  }

  if (groupData.verificationPending) {
    throw new Error("Verification application is already pending");
  }

  await updateDoc(doc(db, "groups", groupId), {
    verificationPending: true,
    verificationAppliedAt: new Date(),
  });
}

// ============================================
// VIDEO CLIPS MANAGEMENT
// ============================================

// Upload video metadata (actual video should be uploaded to Firebase Storage)
export async function uploadVideoClip(userId, clipData) {
  // Moderate title and description
  moderateText(clipData.title);
  if (clipData.description) {
    moderateText(clipData.description);
  }

  const clipRef = doc(collection(db, "clips"));
  await setDoc(clipRef, {
    ...clipData,
    userId,
    uploadedAt: new Date(),
    views: 0,
    likes: 0,
    reports: 0,
    moderated: true,
    moderatedAt: new Date(),
    approved: true, // In production, this should be false until manually approved
  });

  // Update user activity
  await updateActivityScore(userId, 5);

  return clipRef.id;
}

// Get popular clips
export async function getPopularClips(limitCount = 20) {
  const q = query(
    collection(db, "clips"),
    where("approved", "==", true),
    orderBy("views", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// Report content
export async function reportContent(contentId, contentType, reason) {
  const reportRef = doc(collection(db, "reports"));
  await setDoc(reportRef, {
    contentId,
    contentType, // 'clip', 'user', 'group', 'message'
    reason,
    reportedAt: new Date(),
    status: "pending",
    reviewed: false,
  });

  // Increment report count on the content
  await updateDoc(doc(db, contentType + "s", contentId), {
    reports: increment(1),
  });
}

// ============================================
// BUSINESS MANAGEMENT
// ============================================

// Apply for business registration
export async function applyForBusiness(userId, businessData) {
  // Moderate all text fields
  moderateText(businessData.name);
  moderateText(businessData.description);
  moderateText(businessData.category);

  const businessRef = doc(collection(db, "businesses"));
  await setDoc(businessRef, {
    ...businessData,
    ownerId: userId,
    createdAt: new Date(),
    approved: false,
    verificationPending: true,
    followers: 0,
    rating: 0,
    moderated: true,
    moderatedAt: new Date(),
  });

  return businessRef.id;
}

// Get businesses by category
export async function getBusinessesByCategory(category, limitCount = 20) {
  let q;

  if (category === "all") {
    q = query(
      collection(db, "businesses"),
      where("approved", "==", true),
      orderBy("followers", "desc"),
      limit(limitCount)
    );
  } else {
    q = query(
      collection(db, "businesses"),
      where("approved", "==", true),
      where("category", "==", category),
      orderBy("followers", "desc"),
      limit(limitCount)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// ============================================
// FOLLOWING / SOCIAL
// ============================================

// Follow user or business
export async function followEntity(userId, entityId, entityType) {
  const followRef = doc(collection(db, "follows"));
  await setDoc(followRef, {
    followerId: userId,
    followingId: entityId,
    entityType, // 'user' or 'business'
    createdAt: new Date(),
  });

  // Update follower counts
  await updateDoc(
    doc(db, entityType === "user" ? "users" : "businesses", entityId),
    {
      followers: increment(1),
    }
  );

  // Update user activity
  await updateActivityScore(userId, 1);
}

// ============================================
// SEARCH
// ============================================

// Search users by username (prioritize nearby)
export async function searchUsers(searchTerm, userAreaId, limitCount = 20) {
  // First try to get nearby users
  const nearbyQ = query(
    collection(db, "users"),
    where("areaId", "==", userAreaId),
    where("username", ">=", searchTerm),
    where("username", "<=", searchTerm + "\uf8ff"),
    limit(limitCount)
  );

  const snapshot = await getDocs(nearbyQ);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
    nearby: true,
  }));
}
