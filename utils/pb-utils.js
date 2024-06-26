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

export const getPb = () => {
  if (!window.globalPb) {
    return initPb();
  }

  return window.globalPb;
};

export const signIn = async (identity, password) => {
  await window.globalPb
    .collection("users")
    .authWithPassword(identity, password);
};

export const signOut = () => {
  window.globalPb.authStore.clear();
};

/**
 * @param {DatabaseField&ConvBaseRoutine} routine
 */
export const getImageUrl = async (routine) => {
  const { collectionId, id, image } = routine;
  const fileToken = await window.globalPb.files.getToken();
  return `${PB_URL}/api/files/${collectionId}/${id}/${image}?token=${fileToken}`;
};
