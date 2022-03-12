export default {
  namespaced: true,
  state:  {
    count : 10
  },
  mutations : {
    increment(state, value){
      state.count = value;
    }
  }
};
