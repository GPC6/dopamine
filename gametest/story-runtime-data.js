const DOPA_STORY_TEST_STORAGE_KEY = "dopaStoryEditor.testEpisodes";

function loadDefaultEpisodes() {
  const request = new XMLHttpRequest();
  request.open("GET", "./story-data-scenario3.js", false);
  request.send(null);

  if (request.status !== 200 && request.status !== 0) {
    throw new Error("Cannot load default story data.");
  }

  return Function(request.responseText + "\nreturn EPISODES;")();
}

function loadLocalTestEpisodes() {
  try {
    const rawValue = localStorage.getItem(DOPA_STORY_TEST_STORAGE_KEY);
    if (!rawValue) return null;

    const payload = JSON.parse(rawValue);
    const episodes = payload && payload.episodes ? payload.episodes : payload;
    if (!episodes || typeof episodes !== "object" || Array.isArray(episodes)) return null;

    console.info("Loaded story data from localStorage.");
    return episodes;
  } catch (error) {
    console.warn("Cannot load local test story data.", error);
    return null;
  }
}

const EPISODES = loadLocalTestEpisodes() || loadDefaultEpisodes();
