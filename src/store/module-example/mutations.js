export function setAuthorization(state, payload) {
  return (state.authorization = payload);
}

export function setLeftDrawerOpen(state, payload) {
  return (state.leftDrawerOpen = payload);
}

// ---videos ---
export function setTipoVideo(state, payload) {
  return (state.tipoVideo = payload);
}

export function setFavoritos(state, payload) {
  return (state.favoritos = payload);
}

export function setListFav(state, payload) {
  return (state.listFav = payload);
}

export function setListadoVideos(state, payload) {
  return (state.listadoVideos = payload);
}

export function setListadoVideosTodos(state, payload) {
  return (state.listadoVideosTodos = payload);
}

export const updateDialogDeleteVideoState = (state, opened) => {
  state.dialogDeleteVideo = opened;
};

export const updateDialogUploaderVideo = (state, opened) => {
  state.dialogoUploaderVideo = opened;
};

// ---  Podcast ---

export function setListadoPodcast(state, payload) {
  return (state.listadoPodcast = payload);
}

export const updateDialogDeletePodcast = (state, opened) => {
  state.dialogDeletePodcast = opened;
};

export const updateDialogUploaderPodcast = (state, opened) => {
  state.dialogoUploaderPodcast = opened;
};

// --------  Distribuidores ----

export const setListadoUsuarios = (state, payload) => {
  state.listadoUsuarios = payload;
};

export const updateDialogState = (state, opened) => {
  state.dialog = opened;
};

// --------  Clientes ----

export function setListadoClientes(state, payload) {
  return (state.listadoClientes = payload);
}

export const updatedialogClientState = (state, opened) => {
  state.dialogClient = opened;
};
