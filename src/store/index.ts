import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'

import { StoreState } from './type'

const vuexLocal = new VuexPersistence<StoreState>({
  key: 'vue-chat-local',
  storage: window.localStorage,
  reducer: (state) => ({ username: state.username }),
})

export const store = createStore({
  state: {
    id: undefined,
    username: '',
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
    setId(state, id) {
      state.id = id
    },
  },
  plugins: [vuexLocal.plugin],
})
