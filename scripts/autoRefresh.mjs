/**
 * @author aduh95
 * Really simple WebSocket client module
 *
 * Its goal is to reload the page anytime the server send something.
 */

const SOCKET_ADDRESS = `ws://${location.host}/`;
const socket = new WebSocket(SOCKET_ADDRESS);

const SCROLL_POSITION_STORAGE = "scrollPosition";
const savedScrollPosition = window.sessionStorage.getItem(
  SCROLL_POSITION_STORAGE
);
if (savedScrollPosition) {
  window.scroll(0, savedScrollPosition);
  window.sessionStorage.removeItem(SCROLL_POSITION_STORAGE);
}

const reloadPage = () => location.reload();

const onClose = () => {
  console.info("Connection lost");
  setInterval(() => {
    new WebSocket(SOCKET_ADDRESS).onopen = reloadPage;
  }, 3000);
};

// Listen for messages to reload the page
socket.addEventListener("message", () => {
  socket.removeEventListener("close", onClose);
  window.sessionStorage.setItem(SCROLL_POSITION_STORAGE, window.scrollY);
  window.requestAnimationFrame(reloadPage);
});

window.addEventListener("beforeunload", () =>
  socket.removeEventListener("close", onClose)
);

// When server closes the connection, let's close the tab
socket.addEventListener("close", onClose);

export default socket;
