// Github 가져오기
class Github {
  constructor() {
    // 다른 변수들은 그대로 유지
    this.repos_count = 5;
    this.repos_sort = "created: desc";
  }

  // getUser(유저 정보 가져오기) 함수를 axios를 사용하여 변경(사용한도 5000회로 늘림)
  async getUser(user) {
    try {
      const profileResponse = await axios.get(`https://api.github.com/users/${user}`, {
        headers: {
          Authorization: "token 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"
        }
      });

      const repoResponse = await axios.get(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}`, {
        headers: {
          Authorization: "token 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"
        }
      });

      return {
        profile: profileResponse.data,
        repos: repoResponse.data
      };
    } catch (error) {
      // 오류 처리 코드. 필요에 따라 추가 및 수정할 수 있습니다.
      console.error("Error fetching data from GitHub API:", error);
      return null;
    }
  }
}

// 
class Div {
  constructor() {
    this.profile = document.getElementById("profile");
    this.contribution = document.getElementById("zandi");
    this.repos = document.getElementById("repos");
  }

  showProfile(user) {
    this.profile.innerHTML = `
        <div class = "profile-container">
          <div class = "profile-row-container">
            <div class="profile-row-left-container">
              <img class = "profile-pic" src="${user.avatar_url}">
              <a href="${user.html_url}" target="_blank" class="view-profile-btn">View profile</a>          
            </div>
            <div class="profile-row-right-container">
              <div class="profile-row-row-right-container">
               <span class="pr">Public Repos: ${user.public_repos}</span>
                <span class="pg">Public Gist: ${user.public_gists}</span>
                <span class="followers">Followers: ${user.followers}</span>
                <span class="following">Following: ${user.following}</span>
                </div>
              <ul class="list-group">
                <li class="list-group-item">Company: ${user.company}</li>
                <li class="list-group-item">Website/Blog: ${user.blog}</li>
                <li class="list-group-item">Location: ${user.location}</li>
                <li class="list-group-item">Member Since: ${user.created_at}</li>
              </ul>
            </div>
          </div>
        </div>
              
      `;
  }

  showContribution(user) {
    //forEach 가 반복해서 돌때 새 객체를 만들기 위한 빈배열 초기화
    this.contribution.innerHTML = `
      <div class="zandi-container">
      <img class = "zandi-shell" src="https://ghchart.rshah.org/${user.login}"/></div>
      <h3 class="page-heading-mb-3">Latest Repos</h3>
      `;
    };
   

  showRepos(repos) {
    //forEach 가 반복해서 돌때 새 객체를 만들기 위한 빈배열 초기화
    let output = "";

    repos.forEach(function (repo) {
      // 위에 초기화된 내용 이전에 작성 되었던 내용을 남겨 놓겠다는 내용
      output += `
      <div class="card-mb-3">
        <div class="card-body-mb-2">
          <div class="row">
            <div class="col-md-6">
              <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            </div>
            <div class="col-md-7">
            <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
            <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
            <span class="badge badge-success">Forks: ${repo.forks_count}</span>
            </div>
          </div>
        </div>
        </div>
      `;
    });
    // 위 repos 를 html repos에 할당하라는 얘기
    document.getElementById("repos").innerHTML = output;
  }


  // Show alert
  showAlert(message, className) {

    this.clearAlert();

    const div = document.createElement("div");
   
    div.className = className;

    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".searchContainer");

    const search = document.querySelector(".search");

    container.insertBefore(div, search);

    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  clearAlert() {
    const currentAlert = document.querySelector(".alert");

    if (currentAlert) {
      currentAlert.remove();
    }
  }

  clearProfile() {
    this.profile.innerHTML = "";
    this.contribution.innerHTML = "";
  }

  clearrepos() {
    this.repos.innerHTML = "";
    
  }
}


// Github class 를 상수로 할당(모듈화)
const github = new Github();

// div class 를 상수로 할당(모듈화)
const ui = new Div();

// Input 입력 값을 상수화

const searchUser = document.getElementById("searchUser");

//keyup 이벤트가 일어날때 searchUser의 요소중 value가 타깃되고 그걸 userText라는 상수로 정의 하는 내용
searchUser.addEventListener("keyup", (e) => {
  const userText = e.target.value;
//userText가 비어있지 않으면 다음 줄 실행
  if (userText !== "") {
    //
    github.getUser(userText).then((data) => {
      if (data.profile.message === "Not found") {

        ui.showAlert("User not found", "alert alert-danger");
      } else {
 
        ui.showProfile(data.profile);
        ui.showRepos(data.repos);
        ui.showContribution(data.profile);
      }
    });
  } else {
    // Clear Profile
    ui.clearProfile();
    ui.clearrepos();
  }
});

