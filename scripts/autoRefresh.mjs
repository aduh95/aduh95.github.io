/**
 * @author aduh95
 * Really simple WebSocket client module
 *
 * Its goal is to reload the page anytime the server send something
 * and to close it once the server closes the connection.
 */

const socket = new WebSocket("ws://" + window.location.host + "/");

const SCROLL_POSITION_STORAGE = "scrollPosition";
const savedScrollPosition = window.sessionStorage.getItem(
  SCROLL_POSITION_STORAGE
);
if (savedScrollPosition) {
  window.scroll(0, savedScrollPosition);
  window.sessionStorage.removeItem(SCROLL_POSITION_STORAGE);
}

const onClose = () => console.info("Connexion lost");

// Listen for messages to reload the page
socket.addEventListener("message", () => {
  socket.removeEventListener("close", onClose);
  window.sessionStorage.setItem(SCROLL_POSITION_STORAGE, window.scrollY);
  window.requestAnimationFrame(() => window.location.assign("/"));
});

window.addEventListener("beforeunload", () =>
  socket.removeEventListener("close", onClose)
);

// When server closes the connection, let's close the tab
socket.addEventListener("close", onClose);

export default socket;
