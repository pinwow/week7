let result = [];
const list = document.querySelector('.ticketCard-area');
const addBtn = document.querySelector('.addTicket-btn');
const ticketName = document.querySelector('#ticketName');
const imgUrl = document.querySelector('#ticketImgUrl');
const area = document.querySelector('#ticketRegion');
const price = document.querySelector('#ticketPrice');
const group = document.querySelector('#ticketNum');
const rate = document.querySelector('#ticketRate');
const description = document.querySelector('#ticketDescription');
const regionSearch = document.querySelector('.regionSearch');

axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json')
    .then(function(res){
      result = res.data; //陣列 包 物件
      renderData(result);
      addCity();
    });

/** 渲染卡片*/
function renderData(arr){
  let str = '';
  arr.forEach(function(item){
    str = str + `<li class="ticketCard">
                              <div class="ticketCard-img">
                                <a href="#">
                                  <img src=${item.imgUrl}
                                    alt="">
                                </a>
                                <div class="ticketCard-region">${item.area}</div>
                                <div class="ticketCard-rank">${item.rate}</div>
                              </div>
                              <div class="ticketCard-content">
                                <div>
                                  <h3>
                                    <a href="#" class="ticketCard-name">${item.name}</a>
                                  </h3>
                                  <p class="ticketCard-description">
                                    ${item.description}
                                  </p>
                                </div>
                                <div class="ticketCard-info">
                                  <p class="ticketCard-num">
                                    <span><i class="fas fa-exclamation-circle"></i></span>
                                    剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                                  </p>
                                  <p class="ticketCard-price">
                                    TWD <span id="ticketCard-price">$${item.price}</span>
                                  </p>
                                </div>
                              </div>
                            </li>`;
    
  });
  list.innerHTML =  str;
}

/** 統計各城市的行程數, 整理成物件格式*/
let data = {};
function addCity(){
  result.forEach(item => {
    if(data[item.area] == undefined){ //data無 城市property
      data[item.area] = 1;
    }else{
      data[item.area] = data[item.area] + 1;
    }
  });
  // console.log(data); // {高雄: 1, 台北: 1, 台中: 1}
  
  renderChart(data);
  
}

/**渲染圖表 */
function renderChart(obj){
  const cities = Object.keys(obj);// 拿到cities list
  const resultList = [];
  cities.forEach(item => {
    let tempList = [];  
    tempList.push(item);
    tempList.push(data[item]);
    //console.log(tempList); //js list可塞不同data type, 沒有規定只能裝同一個資料型別
    
    resultList.push(tempList);
    
    let chart = c3.generate({
      bindto: '#chart', // HTML 元素綁定
      data: {
        columns: resultList, // 資料存放
        type:"donut",
        colors: {
          '台北': '#26C0C7',
          '高雄': '#E68618',
          '台中': '#5151D3'
        }
      },
    });
  });
}


/**新增套票 */
addBtn.addEventListener('click',function(){
  let obj = {
    name: ticketName.value, //
    imgUrl: imgUrl.value, // https://github.com/hexschool/2022-web-layout-training/blob/main/js_week5/travel_4.png?raw=true
    area: area.value,
    price: price.value,
    group: group.value,
    rate: rate.value,
    description: description.value,
  }

  result.push(obj);
  
  list.innerHTML = list.innerHTML + `<li class="ticketCard">
                                      <div class="ticketCard-img">
                                        <a href="#">
                                          <img src=${obj.imgUrl}
                                            alt="">
                                        </a>
                                        <div class="ticketCard-region">${obj.area}</div>
                                        <div class="ticketCard-rank">${obj.rate}</div>
                                      </div>
                                      <div class="ticketCard-content">
                                        <div>
                                          <h3>
                                            <a href="#" class="ticketCard-name">${obj.name}</a>
                                          </h3>
                                          <p class="ticketCard-description">
                                            ${obj.description}
                                          </p>
                                        </div>
                                        <div class="ticketCard-info">
                                          <p class="ticketCard-num">
                                            <span><i class="fas fa-exclamation-circle"></i></span>
                                            剩下最後 <span id="ticketCard-num"> ${obj.group} </span> 組
                                          </p>
                                          <p class="ticketCard-price">
                                            TWD <span id="ticketCard-price">$${obj.price}</span>
                                          </p>
                                        </div>
                                      </div>
                                    </li>`;

  
  data[obj.area] = data[obj.area] + 1;
  renderChart(data);
});


/**篩選套票 */
regionSearch.addEventListener('change',function(){
  const region = regionSearch.value;
  if(region == '全部地區'){
    renderData(result);
    renderChart(data);
    return;
  }
  const filterList = result.filter(item => {
    return item.area == region; //要加return filterList才會拿到東西, 否則為[]
  });
  renderData(filterList);

  let newData = {}
  newData[region] = data[region];

  renderChart(newData);
})