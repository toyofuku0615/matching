// Follow the visible viewport when a mobile browser opens its on-screen keyboard.
export function observeViewport() {
  const update = () =>
    document.documentElement.style.setProperty(
      "--app-height",
      `${window.visualViewport?.height ?? window.innerHeight}px`,
    );
  update();
  window.visualViewport?.addEventListener("resize", update);
  window.addEventListener("resize", update);
}
