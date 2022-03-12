<template>
  <q-page class=" window-width " >
    <!-- <q-input
      class="search"
      color="primary"
      bg-color="white"
      outlined
      standout="bg-teal"
      v-model="search"
        
      placeholder="검색"
      dense
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input> -->
    <q-btn class="search" unelevated align="left" style="background: white; color: black" label="검색" icon="search" />
    <div id="map"></div>
    
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";

export default ({
  setup() {
    const state = ref({
      map : null,
    })
    const initMap = () => {
      var container = document.getElementById('map');
      var options = { //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 6 //지도의 레벨(확대, 축소 정도)
      };
      state.value.map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
      search();
    }  

    const search = () =>{
      var infowindow = new kakao.maps.InfoWindow({zIndex:1});
      var ps = new kakao.maps.services.Places(); 

      // 키워드로 장소를 검색합니다
      ps.keywordSearch('이태원 맛집', placesSearchCB); 

      // 키워드 검색 완료 시 호출되는 콜백함수 입니다
      function placesSearchCB (data, status, pagination) {
          if (status === kakao.maps.services.Status.OK) {

              // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
              // LatLngBounds 객체에 좌표를 추가합니다
              var bounds = new kakao.maps.LatLngBounds();

              for (var i=0; i<data.length; i++) {
                  displayMarker(data[i]);    
                  bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
              }       

              // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
              state.value.map.setBounds(bounds);
          } 
      }

     // 지도에 마커를 표시하는 함수입니다
      function displayMarker(place) {
          
        // 마커를 생성하고 지도에 표시합니다
        var marker = new kakao.maps.Marker({
            map: state.value.map,
            position: new kakao.maps.LatLng(place.y, place.x) 
        });

        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function() {
            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
            infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
            infowindow.open(state.value.map, marker);
        });
      }
    }

    onMounted(() => {     
      if(!window.kakao || !window.kakao.map){
        const script = document.createElement("script");
        script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=519d667082f509e8268b0fd1d331ee99&libraries=services";
        document.head.appendChild(script);
        script.onload = () => kakao.maps.load(() => initMap());
        console.log("첫 로딩");
      } else{
        console.log("이미 로딩됨");
      }     
    })
    return{
      state,
      initMap,
    }
  }

  
});
</script>
<style scoped>
  .q-page{
    height: 50vh;
  }
  #map{
    width: 100%;
    height: 100%;
    top:0px;
    position: absolute;
  }
  .search{
    display: block;
    border: 1px groove gray;
    width: 65vw;
    top: 2vh;
    margin: auto;
    position: relative;
    z-index: 2000;
    
  }
</style>
