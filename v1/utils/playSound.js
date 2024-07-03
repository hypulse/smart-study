function playSound(audioId = "alert") {
  return new Promise((resolve, reject) => {
    const audio = document.getElementById(audioId);

    if (!audio) {
      reject(new Error("No audio element found with ID: " + audioId));
      return;
    }

    audio.addEventListener("ended", () => {
      resolve("Playback successfully ended.");
    });

    audio.play().catch((error) => {
      reject(new Error("Error playing the audio: " + error));
    });
  });
}

export default playSound;
