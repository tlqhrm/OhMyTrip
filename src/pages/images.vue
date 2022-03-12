<template>
  <q-page class="r">
   
  </q-page>
</template>

<script>
import { ref, computed } from 'vue';
import {useStore} from 'vuex';

export default ({
  setup() {
    const store = useStore();
    const count = computed(() => store.state.example.count);

    return{
      count,
      text: ref('')
    }
  }
  
});
</script>
