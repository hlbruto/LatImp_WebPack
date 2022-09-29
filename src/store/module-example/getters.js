export function someGetter(/* state */) {}

export function authorization(state) {
  return state.authorization;
}

export function leftDrawerOpen(state) {
  return state.leftDrawerOpen;
}

// --- Videos ---

export function tipoVideo(state) {
  return state.tipoVideo;
}

export function listFav(state) {
  return state.listFav;
}

export function favoritos(state) {
  return state.favoritos;
}

export function listadoVideos(state) {
  return state.listadoVideos;
}

export function listadoVideosTodos(state) {
  return state.listadoVideosTodos;
}

export function dialogDeleteVideo(state) {
  return state.dialogDeleteVideo;
}

// ----  Podcast  ----
export function listadoPodcast(state) {
  return state.listadoPodcast;
}

export function dialogDeletePodcast(state) {
  return state.dialogDeletePodcast;
}

// ----  Distribuidores  ----
export function listadoUsuarios(state) {
  return state.listadoUsuarios;
}

export function dialog(state) {
  return state.dialog;
}

// ----  Clientes  ----
export function listadoClientes(state) {
  return state.listadoClientes;
}

export function dialogClient(state) {
  return state.dialogClient;
}

export function add(state) {
  return state.add;
}
