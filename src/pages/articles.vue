<template>
  <q-page class="flex flex-center">
    {{count}}
    <button @click="increment">+</button>
  </q-page>
</template>

<script>
import { computed } from '@vue/runtime-core';
import {useStore} from 'vuex';

export default ({
  setup() {
    const store = useStore();
    const count = computed(() => store.state.example.count);
    const increment = () => {
      store.commit("example/increment",store.state.example.count+1);
    }
    return{
      store,
      count,
      increment
    }
  }
});
</script>
