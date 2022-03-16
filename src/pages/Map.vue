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
    <q-header elevated style="height:40px">
        {{state.addressName}}
    </q-header>
    <q-btn @click="search()" class="search" unelevated align="left" style="background: white; color: black" label="검색" icon="search" />

    <q-btn @click="myLocation()" push round class="z-index location">
    <q-avatar size="40px" font-size="15px" color="white" text-color="black" icon="gps_fixed" />
    </q-btn>
 
    <div id="map"></div>
     
    <div class="window-width" :style="{height:'35px', zIndex:3000, backgroundColor:'white', position:'absolute', bottom:'0px', borderTop: '1px rgba(0, 0, 0, 0.35) solid'}">
      <q-toggle  v-model="state.result" label="검색결과" class="q-mb-md" />
    </div> 

    <div class="scroll absolute-bottom" style="border-top: 2px solid rgba(0, 0, 0, 0.5); 
    margin-bottom: 37px;" v-show="state.result"/>  
    <q-scroll-area class="scroll absolute-bottom" v-show="state.result">
      
      <div class="row no-wrap" style="font-size:12px">
        <div v-for="(item, idx) in state.keywordResult" :key="idx" style="width: 160px " class="q-pa-sm">
          <div :style="{background: 'url('+G.src+')',backgroundPosition:G.markerXY[idx].x+'px '+G.markerXY[idx].y+'px',width:'23px', height:'36px', display:'inline-block'}">
          </div>
          <div style="display:inline-block; width:120px; height:36px; position:absolute; top:10px">{{item.place_name}}</div>
          <div>
          {{item.address_name}}
          </div>
        </div>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { useQuasar } from 'quasar'
import src from '../assets/markers.png';
import axios from 'axios';

export default ({
  setup() {
    const $q = useQuasar();
    const G = {
      src : src,
      markerXY : [],
      CenterXY : null,
      test : {
        a : 1,
        b : 2,
        c : {
          a:3,
          b:4,
          c:{
            a:5,
            b:6,
            c:[{
              a:7,
              b:8,
              c:[{
                a:9,
                b:10
              }]
            }]
          }
        }
      }

    }
    const state = ref({
      //카카오 map 객체 
      map : null,
      //지도 bounds 값들
      bounds :null,
      swLatlng : null,
      neLatlng : null,
      //지도 bounds 남서
      // sw : null,
      //지도 bounds 북동
      // ne : null,
      // kakao.maps.services.Places()
      ps :null,
      //키워드검색 마커 배열
      searchMakers : [],
      //인포윈도우
      infowindow : null,
      //키워드검색 page 
      searchCount : 1,
      //검색결과 visible
      result : true,
      //키워드 검색결과
      keywordResult: [],
      //현재위치 지명
      addressName : null,
    })
    
    //지도 로딩시
    const initMap = () => {
      var container = document.getElementById('map');
      var options = { //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(37.2635846787744, 127.028715898311), //지도의 중심좌표.
      level: 6 //지도의 레벨(확대, 축소 정도)
      };
      state.value.map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
      state.value.bounds = state.value.map.getBounds();
      state.value.infowindow = new kakao.maps.InfoWindow({
          zIndex:1,
          removable: true,
        });
      state.value.ps = new kakao.maps.services.Places();  
      // dragend(); //dragend 이벤트리스너
      zoomChanged(); //zoomChanged 이벤트리스너
      console.log()
    }  

    const dragend = () => {
      kakao.maps.event.addListener(state.value.map, 'dragend', function() {             
        
      });
    }
    const zoomChanged = () =>{
      let latlng; 
      console.log(state.value.map.getCenter());
      kakao.maps.event.addListener(state.value.map, 'dragend', function() {  
        latlng = state.value.map.getCenter();       

        axios.get('https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',{
          // baseURL : '',
          headers :{Authorization : 'KakaoAK 48bef91e5643428c5d52556e0320e1ff'},
          params : {
            x : latlng.getLng(),
            y : latlng.getLat()
          }          
        }).then((response) => {
          state.value.addressName = response.data.documents[1].address_name;
          console.log(response.data.documents[1]);
        }) 
      });
    }

    const myLocation = () => {
      if (navigator.geolocation) {
    
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {
          
          var lat = position.coords.latitude, // 위도
              lon = position.coords.longitude; // 경도
          
          var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
              message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다
          
          // 마커와 인포윈도우를 표시합니다
          // displayMarker(locPosition, message);
          
          state.value.map.setCenter(locPosition)
        });
        
      } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
          
          var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
              message = 'geolocation을 사용할수 없어요..'
              
          // displayMarker(locPosition, message);
      }
    } 

    //키워드검색
    const search = () =>{
      state.value.searchCount = 1;
      state.value.keywordResult = [];
      var bounds = state.value.map.getBounds(); 
      var swLatlng = bounds.getSouthWest();
      // 영역정보의 북동쪽 정보를 얻어옵니다 
      var neLatlng = bounds.getNorthEast();
      var sw = new kakao.maps.LatLng(swLatlng.Ma, swLatlng.La);
      var ne = new kakao.maps.LatLng(neLatlng.Ma, neLatlng.La);

      var placesSearchCB = (data, status) =>{      
        console.log(state.value.searchCount);    
        console.log(state.value.searchMakers[0]); 
        if (status === kakao.maps.services.Status.OK) {            
            if(state.value.searchCount == 1){
              for(var i=0; i<state.value.searchMakers.length; i++){
                //기존 infowindow 삭제
                
                state.value.infowindow.close();
                //기존 마커 삭제
                state.value.searchMakers[i].setMap(null);
              }            
            }
            if(data.length == 15 && state.value.searchCount < 3){
              pushMarker(data);               
              state.value.searchCount++;
              state.value.ps.keywordSearch('스타벅스', placesSearchCB, {bounds : new kakao.maps.LatLngBounds(sw, ne), page: state.value.searchCount});      
            }else {
              pushMarker(data);
              sortMarker();
              for(let i=0; i<state.value.keywordResult.length; i++){
                console.log(i)
                setMarker(state.value.keywordResult[i],i);
              }
              if(data.length == 15 && state.value.searchCount ==3){
                triggerWarning();
              }
            }
            console.log(data);
        } 
      }
      // 키워드로 장소를 검색합니다
      state.value.ps.keywordSearch('스타벅스',placesSearchCB, {bounds : new kakao.maps.LatLngBounds(sw,ne), page: state.value.searchCount});  
    }
    const pushMarker = (data) =>{
        for (let i=0; i<data.length; i++){
          state.value.keywordResult.push(data[i])
        }
        console.log(state.value.keywordResult);
    }
    const sortMarker = () =>{
        state.value.keywordResult.sort(function(a,b){
          return b.y - a.y;
        })
        console.log(state.value.keywordResult);
    }
    const setMarker = (place,i) => {
        var spriteX = (Math.floor(i/5) * 40) + 10;
        var spriteY = (40*(i%5)) + 12;         
        G.markerXY.push({x : -spriteX, y: -spriteY});
        // console.log(spriteX);
        // console.log(spriteY);
        // var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        var imageSrc = G.src,
            imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
            imgOptions =  {
              spriteSize : new kakao.maps.Size(405, 259), // 스프라이트 이미지의 크기
              spriteOrigin : new kakao.maps.Point(spriteX, spriteY), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
              offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
            },
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);

        // 마커를 생성하고 지도에 표시합니다
        var marker = new kakao.maps.Marker({
            map: state.value.map,
            position: new kakao.maps.LatLng(place.y, place.x),
            image: markerImage, 
        });
        //마커 배열에 등록
        state.value.searchMakers.push(marker);
        console.log(marker);
        // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function() {
            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
            state.value.infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
            state.value.infowindow.open(state.value.map, marker);

        });
    }

    const visible = () => {
      if(state.value.result == false){
        state.value.result = true;
        state.value.bottom = 150;
      }else{
        state.value.result = false;
        state.value.bottom = 0;
      }
    }
    
    const triggerWarning = () =>{
      $q.notify({
        type : 'warning',
        message : '키워드검색의 최대검색결과 45개를 초과했습니다.',
        caption: '일부 검색결과가 누락될 수 있습니다.',
        
      })
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
      G,
      state,
      initMap,
      search,
      myLocation,
      visible,
      pushMarker,
      sortMarker,
      setMarker,
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
    top: 5%;
    margin: auto;
    position: relative;
    z-index: 2000;
  }
  .z-index{
    z-index: 3000;
    top: 8vh;
    left:2vh;
    position: absolute;
  }
  .scroll{
    z-index: 2000;
    height: 150px;
    background-color: white;
    /* border-top: 2px solid rgba(0, 0, 0, 0.5);  */
    margin-bottom: 35px;
  }
</style>
