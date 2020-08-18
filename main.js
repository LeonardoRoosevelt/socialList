const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";
const POSTER_URL = BASE_URL + "/posters/";
const REGION_URL = "https://restcountries.eu/rest/v2/region/";

const view = {
  changeMode: document.querySelector("#modeList"),
  dataPanel: document.querySelector("#data-panel"),
  paginator: document.querySelector("#paginators"),
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#search-input"),
  refresh: document.querySelector("#refresh"),
  favoriteList: document.querySelector("#favoriteList"),
  likeList: document.querySelector("#favorite"),
  avatarMode: document.querySelector("#cardMode"),
  listMode: document.querySelector("#listMode"),
  likeIcon: document.querySelector("#likeIcon"),
  ageInput: document.getElementById("ageInput"),
  ageValue: document.querySelector(".ageLabel"),
  modalName: document.querySelector("#user-modal-name"),
  modalGender: document.querySelector("#user-modal-gender"),
  modalAge: document.querySelector("#user-modal-age"),
  modalAvatar: document.querySelector("#user-modal-avatar"),
  modalBirthday: document.querySelector("#user-modal-birthday"),
  modalRegion: document.querySelector("#user-modal-region"),
  modalEmail: document.querySelector("#user-modal-email"),
  modalId: document.querySelector("#user-modal-id"),
  regionList: document.querySelector("#regionList"),
  renderUserAvatarMode(data) {
    let rawHTML = "";
    data.forEach(item => {
      //title, image
      rawHTML += `
          <div class="col-sm-3">
            <div class="mx-2 my-2">
              <div class="card border-0 ">
                <img class="card-img-top img-thumbnail rounded-circle" data-toggle="modal"
                    data-id = "${item.id}" src="${item.avatar}">
            <div class="row">
              <div class="col-9">
                <h6 class="card-title text-center "><strong>${item.name} </br>${item.age}/${item.region}</strong></h6>
              </div>
              <div class="col-1 likeDiv text-danger" >
                <i class="fa fa-heart-o fa-2x like-for-like" id="likeIcon" data-id="${item.id}" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    });
    // processing
    view.dataPanel.innerHTML = rawHTML;
  },
  renderUserListMode(data) {
    let rawHTML = "";

    data.forEach(item => {
      //title, image
      rawHTML += `
          <div class="col-12">
            <div class="row justify-content-between">
              <div class="col-9 listData">
  <img class="listAvatar" data-toggle="modal" data-id = "${item.id}" src="${item.avatar}">
                <a class="card-title text-center "><strong>${item.name} ${item.surname} / ${item.age} / ${item.region}</strong></a>
              </div>
              <div class="col-1 likeDiv text-danger" >
                <i class="fa fa-heart-o fa-2x like-for-like" id="likeIcon" data-id="${item.id}" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    });
    // processing
    view.dataPanel.innerHTML = rawHTML;
  },
  renderLikeModal(data) {
    let rawHTML = "";
    if (data !== null) {
      data.forEach(item => {
        //title, image
        rawHTML += `
                <li class="likeName list-group-item" data-id="${item.id}">${item.name}</li>`;
      });
      // processing
      view.favoriteList.innerHTML = rawHTML;
    }
  },
  renderUserModal(data) {
    view.modalAvatar.innerHTML = `<img src='${data.avatar}' alt="user-poster" class="avatar-fluid">`;
    view.modalId.innerText = "ID : " + data.id;
    view.modalName.innerText = `${data.name} ${data.surname}`;
    view.modalGender.innerText = "GENDER : " + data.gender;
    view.modalAge.innerText = "AGE : " + data.age;
    view.modalBirthday.innerText = "BIRTHDAY : " + data.birthday;
    view.modalRegion.innerText = "REGION : " + data.region;
    view.modalEmail.innerText = "EMAIL : " + data.email;
  },
  renderPaginator(data) {
    let rawHTML = "";
    for (let page = 1; page <= data; page++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="javascript:;" data-page="${page}">${page}</a></li>`;
    }
    //放回 HTML
    view.paginator.innerHTML = rawHTML;
  }
};

const model = {
  users: [],
  filteredUsers: [],
  filteredOriginal: [],
  nowPage: 1,
  mode: "avatar",
  maxAge: 80,
  USERS_PER_PAGE: 12,
  gender: "all",
  genderAlert: ["切選為女性", "切選為男性", "所有性別"],
  regionData: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
  countriesCodes: {
    Afirca: [],
    Americas: [],
    Asia: [],
    Europe: [],
    Oceania: []
  },
  filterRegionData: [],
  keywords: "",
  numberOfPages: 0,
  getUsersByPage(page) {
    const data = model.filteredUsers.length
      ? model.filteredUsers
      : model.filteredOriginal;
    //計算起始 index
    const startIndex = (page - 1) * model.USERS_PER_PAGE;
    //回傳切割後的新陣列amount
    return data.slice(startIndex, startIndex + model.USERS_PER_PAGE);
  },
  filterGender() {
    const data = model.filteredUsers.length ? model.filteredUsers : model.users;
    if (model.gender === "all") {
      model.filteredUsers = data;
    } else if (model.gender === "female") {
      model.filteredUsers = data.filter(user => user.gender === model.gender);
    } else if (model.gender === "male") {
      model.filteredUsers = data.filter(user => user.gender === model.gender);
    }
  },
  updateGender(data) {
    model.gender = data;
  },
  resetFilteredUsers() {
    model.filteredUsers = [];
  },
  filterAge() {
    const data = model.filteredUsers;
    model.filteredUsers = data.filter(user => user.age < model.maxAge);
  },
  filterInput() {
    const data = model.filteredUsers;
    model.filteredUsers = data.filter(
      user =>
        user.name.toLowerCase().includes(model.keywords) ||
        user.surname.toLowerCase().includes(model.keywords)
    );
  },
  renderPaginator(amount) {
    //計算總頁數
    model.numberOfPages = Math.ceil(amount / model.USERS_PER_PAGE);
  },
  getCountryCodesOfRegion(region, array) {
    model.countriesCodes[region] = array.map(item => item.alpha2Code);
  },
  filterUsersByRegion() {
    const data = model.filteredUsers;
    model.filteredUsers = data.filter(user =>
      model.filterRegionData.includes(user.region)
    );
  },
  updateFilteredRegionData(region) {
    model.resetFilteredRegionData();
    model.combineCountriesCodes(region, model.countriesCodes);
  },
  combineCountriesCodes(region, array) {
    model.filterRegionData = model.filterRegionData.concat(array[`${region}`]);
  },
  resetFilteredRegionData() {
    model.filterRegionData = [];
  },
  filteredUsersOriginal() {
    model.filteredOriginal = model.filteredUsers;
  }
};

const controller = {
  init() {
    controller.loadData();
    controller.renderRegionList(...model.regionData);
    controller.eventListener();
  },
  eventListener() {
    view.refresh.addEventListener("click", controller.refreshData);
    view.paginator.addEventListener("click", controller.onPaginatorClicked);
    view.changeMode.addEventListener("click", controller.onModeClicked);
    view.searchForm.addEventListener(
      "submit",
      controller.onSearchFormSubmitted
    );
    view.ageInput.addEventListener("mousedown", controller.ageChanging);
    view.dataPanel.addEventListener("click", controller.onPanelClicked);
    view.favoriteList.addEventListener("click", controller.onClickFavorite);
    view.regionList.addEventListener("click", controller.onClickRegion);
  },

  ageChanging() {
    view.ageInput.addEventListener("mousemove", controller.searchByAge);
  },

  loadData() {
    axios
      .get(INDEX_URL)
      .then(response => {
        model.users.push(...response.data.results);
        controller.renderSystem();
        localStorage.removeItem("likeUsers");
      })
      .catch(err => console.log(err));
  },
  renderUserList(data) {
    model.mode === "avatar"
      ? view.renderUserAvatarMode(data)
      : view.renderUserListMode(data);
  },
  refreshData() {
    localStorage.removeItem("likeUsers");
    history.go(0);
    alert("回初始畫面");
  },
  onPaginatorClicked(event) {
    //如果被點擊的不是 a 標籤，結束
    if (event.target.tagName !== "A") return;
    //透過 dataset 取得被點擊的頁數
    const page = Number(event.target.dataset.page);
    //更新畫面
    controller.renderUserList(model.getUsersByPage(page));
  },
  onModeClicked() {
    controller.showLikeList();
    controller.modeChange();
    controller.genderChange();
    controller.renderSystem();
  },
  showLikeList() {
    let usersLikeList = JSON.parse(localStorage.getItem("likeUsers"));
    if (event.target.matches("#likeList")) {
      view.likeList.classList.toggle("block");
      view.renderLikeModal(usersLikeList);
    }
  },
  modeChange() {
    if (event.target.matches("#listMode")) {
      model.mode = "list";
    } else if (event.target.matches("#avatarMode")) {
      model.mode = "avatar";
    }
  },
  genderChange() {
    if (event.target.matches("#changeGender")) {
      if (event.target.classList.contains("all")) {
        event.target.classList.remove("all");
        event.target.classList.add("female");
        model.updateGender("female");
        alert(model.genderAlert[0]);
      } else if (event.target.classList.contains("female")) {
        event.target.classList.remove("female");
        event.target.classList.add("male");
        model.updateGender("male");
        alert(model.genderAlert[1]);
      } else if (event.target.classList.contains("male")) {
        event.target.classList.remove("male");
        event.target.classList.add("all");
        model.updateGender("all");
        alert(model.genderAlert[2]);
      }
      controller.renderSystem();
    }
  },
  onSearchFormSubmitted(event) {
    event.preventDefault();
    model.keywords = view.searchInput.value.trim().toLowerCase();

    if (!model.keywords.length) {
      return alert("Please enter keywords");
    }
    //map , filter, reduce
    controller.renderSystem();
    if (model.filteredUsers.length === 0) {
      alert("Can't find the user name with: " + model.keywords);
      return controller.renderSystem();
    }
  },
  searchByAge(event) {
    model.maxAge = event.target.value;
    view.ageValue.innerText = `${model.maxAge}歲以下`;
    controller.renderSystem();
  },
  onPanelClicked(event) {
    if (event.target.matches("img")) {
      controller.renderUserModal(event.target.dataset.id);
      // 修改這裡
    }
    if (event.target.matches(".fa-heart-o")) {
      event.target.classList.toggle("fa-heart-o");
      event.target.classList.toggle("fa-heart");
      controller.likeUsers(Number(event.target.dataset.id));
      alert("已加入喜愛列表");
    } else if (event.target.matches(".fa-heart")) {
      event.target.classList.toggle("fa-heart");
      event.target.classList.toggle("fa-heart-o");
      controller.removeFromLike(Number(event.target.dataset.id));
      alert("已移除喜愛列表");
      // 修改這裡
    }
  },
  removeFromLike(id) {
    let usersLikeList = JSON.parse(localStorage.getItem("likeUsers"));
    const userIndex = usersLikeList.findIndex(user => user.id === id);
    usersLikeList.splice(userIndex, 1);
    localStorage.setItem("likeUsers", JSON.stringify(usersLikeList));
    view.renderLikeModal(usersLikeList);
  },
  likeUsers(id) {
    const usersLikeList = JSON.parse(localStorage.getItem("likeUsers")) || [];
    const user = model.users.find(user => user.id === id);
    if (usersLikeList.some(user => user.id === id)) {
      return;
    }
    usersLikeList.push(user);
    localStorage.setItem("likeUsers", JSON.stringify(usersLikeList));
    view.renderLikeModal(usersLikeList);
  },
  onClickFavorite(event) {
    if (event.target.matches("li")) {
      controller.renderUserModal(event.target.dataset.id);
    }
  },
  renderUserModal(id) {
    axios.get(INDEX_URL + id).then(response => {
      const data = response.data;
      view.renderUserModal(data);
      // 解決非同步問題，跑完 API 才開啟 Modal
      $("#user-modal").modal("show");
    });
  },
  renderRegionList(...regions) {
    regions.forEach(region => {
      axios
        .get(REGION_URL + region)
        .then(response => {
          model.getCountryCodesOfRegion(region, response.data);
          model.combineCountriesCodes(region, model.countriesCodes);
        })
        .catch(err => console.log(err));
    });
  },
  onClickRegion(event) {
    const regionSelected = event.target.id;
    model.updateFilteredRegionData(regionSelected);
    controller.renderSystem();
  },
  filterArea() {
    model.resetFilteredUsers();
    model.filterGender(model.gender);
    model.filterAge();
    model.filterInput();
    model.filterUsersByRegion();
    model.filteredUsersOriginal();
  },
  renderPaginator() {
    model.renderPaginator(model.filteredOriginal.length);
    view.renderPaginator(model.numberOfPages);
  },
  renderSystem() {
    controller.filterArea();
    controller.renderUserList(model.getUsersByPage(model.nowPage));
    controller.renderPaginator();
  }
};
controller.init();
