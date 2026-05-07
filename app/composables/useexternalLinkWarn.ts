export const useExternalLinkWarn = () => {
  const state = useState<{showing: boolean, link: string}>("externalLinkWarn", () => { return { showing: false, link: "" }});

  function show(external_link: string) {
    state.value.link = external_link;
    state.value.showing = true;
  }

  function hide() { state.value.showing = false; }

  return {
    showing: computed(() => state.value.showing),
    link: computed(() => state.value.link),
    show: show,
    hide: hide,
  }
}
