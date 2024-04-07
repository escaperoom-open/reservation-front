<template>
    <div id="cafe-list">
        <div class="popup-box" v-if="isOpenRegionOption || isOpenDateOption"></div>
        <div id="main-container" class="flex-container vertical gap30">
            <p class="text-wrapper">방탈출 예약 오픈 언제하는지 궁금하다면?</p>
            <div class="search-option-container">
                <div id="region-container">
                    <div class="search-option container" @click="isOpenRegionOption = !isOpenRegionOption">
                        <div class="search-option-title">지역</div>
                        <div id="search-option-value" class="search-option-content">{{selectedRegion}}</div>
                    </div>
                    <div id="region-option-container" 
                        class="flex-container vertical popup"
                        v-if="isOpenRegionOption"
                    >
                        <div class="search-option-content"
                            v-for="region in regionList"
                            :key="region.id"
                            @click="changeRegion(region)"
                        >{{region.name}}</div>
                    </div>
                </div>
                <div id="date-container">
                    <div class="search-option container" @click="isOpenDateOption = !isOpenDateOption">
                        <div class="search-option-title">예약 희망 날짜</div>
                        <div class="search-option-content">날짜 선택</div>
                    </div>
                    <v-row
                        id="date-option"
                        class="flex-container vertical popup shadow"
                        v-if="isOpenDateOption" 
                        justify="space-around"
                    >
                        <v-date-picker
                            color="#151515"
                        ></v-date-picker>
                    </v-row>
                </div>
                <div id="date-container" class="container">
                    <label for="region-name" class="search-option flex-grow1">
                        <div class="search-option-title">지점 이름</div>
                        <input id="region-name" class="search-option-content" type="text" placeholder="이름 입력">    
                    </label>
                </div>
                <button id="search-button" class="blue-container flex-container vertical a-center j-center div-wrapper"
                    @click="getCafeList()"
                >
                    <div class="text-wrapper-4">검색하기</div>
                </button>
            </div>
            <div id="cafe-list-container" class="flex-container vertical">
                <table id="cafe-list-header">
                    <tr>
                        <th class="text-wrapper-5">로고</th>
                        <th class="text-wrapper-6">지점 이름</th>
                        <th class="text-wrapper-7">테마</th>
                        <th class="text-wrapper-8">오픈 날짜</th>
                        <th class="text-wrapper-8">오픈 시간</th>
                        <th class="text-wrapper-5">예약 링크</th>
                    </tr>
                </table>
                <div id="cafe-list-body">
                    <table>
                        <tr v-for="cafe in cafeList" :key="cafe.id">
                            <td><img class="logo" :src="cafe.logoImg"/></td>
                            <td class="text-wrapper-9">{{cafe.name}}</td>
                            <td class="p">SILENT (스릴, 수사), LISTEN (액션,스릴)</td>
                            <td class="text-wrapper-10">{{cafe.openDate}}</td>
                            <td class="text-wrapper-10">{{cafe.openTime}}</td>
                            <!-- <td><a id="reservation-button" class="button blue-container flex-container vertical a-center j-center" :href="cafe.reservationLink">예약</a></td> -->
                            <v-btn :href="cafe.reservationLink" target="_blank">예약</v-btn>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios"
// import FullCalendar from '@fullcalendar/vue3'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from '@fullcalendar/interaction'

export default {
    name: 'CafeList',
    components: {
    },
    data() {
        return {
            calendarOptions: {
                // plugins: [ dayGridPlugin, interactionPlugin ],
                initialView: 'dayGridMonth',
                // locale: 'ko',
                headerToolbar: {
                    left: 'title',
                    center: '',
                    right: 'prev,next'
                },
                titleFormat : function(date) {
                    return date.date.year +"년 "+(date.date.month +1)+"월"; 
                },
                columnHeaderText : function(mom) {
                    if (mom.weekday() == 0) {
                        return "일"
                    } else if (mom.weekday() === 1) {
                        return "월"
                    } else if (mom.weekday() === 2) {
                        return "화"
                    } else if (mom.weekday() === 3) {
                        return "수"
                    } else if (mom.weekday() === 4) {
                        return "목"
                    } else if (mom.weekday() === 5) {
                        return "금"
                    } else if (mom.weekday() === 6) {
                        return "토";
                    }
                }
            },
            selectedRegion: "홍대",
            searchOption: {
                regionId: 1,
                wishDate: "",
                name: ""
            },
            regionList: [],
            cafeList: [],
            isOpenRegionOption: false,
            isOpenDateOption: false,
            isOpenPopup: false
        }
    },
    mounted() {
        console.log("CafeList monunted");
        this.getRegionList();
        this.getCafeList();
    },
    methods: {
        changeRegion(region) {
            this.selectedRegion = region.name
            this.searchOption.regionId = region.id
            this.isOpenRegionOption = !this.isOpenRegionOption
        },
        getRegionList() {
            axios
            .get("/region")
            .then(res => {
                console.log(res.data);
                for (const region of res.data) {
                    this.regionList.push({
                        id: region.regionId,
                        name: region.name,
                    })
                }
            })
        },
        getCafeList() {
            axios
            .get("/cafe", {params: this.searchOption})
            .then(res => {
                console.log(res.data);
                this.cafeList = res.data.map((cafe) => {
                    return {
                        id: cafe.cafeId,
                        logoImg: cafe.logoImg,
                        name: cafe.name,
                        openDate: cafe.openDate,
                        openTime: cafe.openTime,
                        reservationLink: cafe.reservationLink
                    }
                })
            })
        }
    }
}
</script>

<style>
#cafe-list {
    height: 100%;
}

#main-container {
    width: 80%;
    height: 100%;
    margin: auto;
}

#cafe-list .text-wrapper {
    font-family: "GangwonEduPower-ExtraBold", Helvetica;
    font-weight: 800;
    color: #ffffff;
    font-size: 20px;
    margin: 0px;
}

#cafe-list .search-option-container {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    position: relative;
    z-index: 3;
}

#cafe-list .search-option-container > div:nth-child(1), #region-option-container {
    width: 15%;
    min-width: 90px;
    max-width: 130px;
}

#cafe-list .search-option-container > div:nth-child(2) {
    width: 20%;
    min-width: 120px;
    max-width: 175px;
}

#cafe-list .search-option {
    display: flex;
    flex-direction: column;
    height: 55px;
    align-items: flex-start;
    justify-content: center;
    gap: 5px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
}

.search-option-container label:active{
    border: 1px solid gray;
}

.search-option-container label input {
    width: 100%;
}

#cafe-list .search-option:hover {
    background-color: var(--gray);
}

#cafe-list .search-option-title {
    position: relative;
    margin-top: -1px;
    font-family: "Noto Sans-DisplaySemiBold", Helvetica;
    font-weight: 600;
    color: var(--main-black);
    font-size: 10px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .search-option-content {
    font-family: "Noto Sans-Medium", Helvetica;
    font-weight: 500;
    color: var(--main-black);
    position: relative;
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#region-option-container, #date-option {
    position: absolute;
    top: 65px;
    z-index: 1;
    background-color: #ffffff;
    border-radius: 10px;
}

#region-option-container {
    max-height: 200px;
    overflow-y: scroll;
    gap: 5px;
}

#region-option-container .search-option-content{
    cursor: pointer;
}

#cafe-list .div-wrapper {
    height: 55px;
    gap: 5px;
    position: relative;
}

#cafe-list .text-wrapper-4 {
    font-family: "Noto Sans-DisplaySemiBold", Helvetica;
    font-weight: 600;
    color: #ffffff;
    position: relative;
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .navbar {
    display: flex;
    height: 50px;
    align-items: center;
    justify-content: space-between;
    top: 240px;
    left: 256px;
    border-bottom-style: solid;
    border-color: #0000001a;
}

#cafe-list .text-wrapper-5 {
    position: relative;
    font-family: "Noto Sans-SemiBold", Helvetica;
    font-weight: 600;
    color: var(--main-black);
    font-size: 12px;
    text-align: center;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .text-wrapper-6 {
    position: relative;
    font-family: "Noto Sans-SemiBold", Helvetica;
    font-weight: 600;
    color: var(--main-black);
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .text-wrapper-7 {
    position: relative;
    font-family: "Noto Sans-SemiBold", Helvetica;
    font-weight: 600;
    color: var(--main-black);
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .text-wrapper-8 {
    position: relative;
    font-family: "Noto Sans-SemiBold", Helvetica;
    font-weight: 600;
    color: var(--main-black);
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .frame-4 {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    top: 305px;
    left: 255px;
}

#cafe-list .frame-5 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    flex: 0 0 auto;
}

#cafe-list .logo-wrapper {
    display: flex;
    height: 37px;
    align-items: center;
    justify-content: center;
    gap: 6.17px;
    padding: 6.17px;
    position: relative;
}

#cafe-list .text-wrapper-9 {
    font-family: "Noto Sans-Medium", Helvetica;
    font-weight: 500;
    color: var(--main-black);
    position: relative;
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .p {
    position: relative;
    font-family: "Noto Sans-Medium", Helvetica;
    font-weight: 500;
    color: var(--main-black);
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .text-wrapper-10 {
    font-family: "Noto Sans-Medium", Helvetica;
    font-weight: 500;
    color: var(--main-black);
    position: relative;
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .frame-6 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 5px 10px;
    position: relative;
    background-color: #3f69ff;
    border-radius: 5px;
}

#cafe-list .text-wrapper-11 {
    margin-top: -1px;
    font-family: "Noto Sans-DisplaySemiBold", Helvetica;
    font-weight: 600;
    color: #ffffff;
    position: relative;
    font-size: 12px;
    letter-spacing: 0;
    line-height: normal;
}

#cafe-list .frame-7 {
    height: 26px;
    top: 37px;
    left: 53px;
    background-color: var(--main-black);
}

#cafe-list-body {
    background-color: #ffffff;
    border-radius: 5px;
    height: 100%;
    overflow-y: scroll;
    flex-grow: 1;
}

#cafe-list-container {
    border-radius: 5px;
    background-color: white;
    overflow: hidden;
    flex-grow: 1;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.1);
}

#cafe-list-container table {
    border-spacing: 0px;
}

#cafe-list-header tr {
    height: 40px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

#cafe-list-header th {
    position: sticky;
    top: 1px;
    background-color: white;
}

#cafe-list-body {
    overflow-y: scroll;
    flex-grow: 1;
}

#cafe-list-container tr, #cafe-list-body tr {
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

#cafe-list-container th, #cafe-list-body td {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    /*text-wrap: nowrap;*/
    padding: 10px;
}

#cafe-list-container table tr th:nth-child(1), #cafe-list-body table tr td:nth-child(1) {
    width: 10%;
    min-width: 50px;
    justify-content: center;
}

#cafe-list-container table tr th:nth-child(2), #cafe-list-body table tr td:nth-child(2) {
    width: 20%;
    min-width: 100px;
    justify-content: flex-start;
}

#cafe-list-container table tr th:nth-child(3), #cafe-list-body table tr td:nth-child(3) {
    flex-grow: 1;
    min-width: 100px;
    justify-content: flex-start;
}

#cafe-list-container table tr th:nth-child(4), #cafe-list-body table tr td:nth-child(4) {
    width: 100px;
    justify-content: center;
}

#cafe-list-container table tr th:nth-child(5), #cafe-list-body table tr td:nth-child(5) {
    width: 90px;
    justify-content: center;
}

#cafe-list-container table tr th:last-child, #cafe-list-body table tr td:last-child {
    width: 10%;
    min-width: 70px;
    justify-content: center;
}

#cafe-list-body table tr td:last-child button {
    width: 60px;
    height: 27px;
    padding: 0px;
    font-family: "Noto Sans-DisplaySemiBold", Helvetica;
    font-weight: 600;
    color: #ffffff;
    background-color: #3f69ff;
    font-size: 12px;
    border-radius: 5px;
}

#search-button {
    height: 55px;
}

#reservation-button {

}

#search-button:hover, #reservation-button:hover {
    background-color: var(--main-blue-active);
    margin: 0px;
}

</style>