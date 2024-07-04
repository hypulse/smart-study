import { PB_URL } from "../env.js";

const initPb = () => {
  window.globalPb = new PocketBase(PB_URL);

  window.globalPb.authStore.onChange((token, model) => {
    const event = new CustomEvent("pb-auth-change", {
      detail: { authenticated: window.globalPb.authStore.isValid },
    });
    document.dispatchEvent(event);
  });

  return window.globalPb;
};

const getPb = () => {
  if (!window.globalPb) {
    return initPb();
  }

  return window.globalPb;
};

const signIn = async (identity, password) => {
  await window.globalPb
    .collection("users")
    .authWithPassword(identity, password);
};

const signOut = () => {
  window.globalPb.authStore.clear();
};

/**
 * @param {DatabaseField&ConvBaseRoutine} routine
 */
const getImageUrl = async (collectionId, id, image) => {
  const fileToken = await window.globalPb.files.getToken();
  return `${PB_URL}/api/files/${collectionId}/${id}/${image}?token=${fileToken}`;
};

const syncAuth = async () => {
  try {
    if (window.globalPb.authStore.isValid) {
      await window.globalPb.collection("users").authRefresh();
    }
  } catch (_) {
    window.globalPb.authStore.clear();
  }
};

export { getPb, signIn, signOut, getImageUrl, syncAuth };
