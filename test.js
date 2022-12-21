const REST_API_KEY = "8ff342306e1b7d862d5f75fbc30bb978";
let bookInfo = {};

// 도서정보 get으로 읽어와서 책갈피 div 생성
  $.get("http://localhost:4000/books", function(data){
    // console.log(JSON.stringify(data), status);
    data.forEach((response) => {
      createDIV(response)
    });
  });


// 검색 버튼 클릭 시 GET으로 도서 api 요청
function search(){
  let bookName = document.getElementById("bookName").value;
    $.ajax({
      method: "GET",
      url: "https://dapi.kakao.com/v3/search/book?target=title",
      data: { query : bookName },
      headers: {Authorization: `KakaoAK ${REST_API_KEY}`}
    })
      .done(function( book) {

        let title = book.documents[0].title;
        let thumbnail = book.documents[0].thumbnail;
        let authors = book.documents[0].authors;
        let contents = book.documents[0].contents;

        // 현재 날짜 불러오기
        let now = new Date();
        let date = dateFormat(now);


        // bookInfo 객체에 검색 도서 정보 저장
        bookInfo.title = title;
        bookInfo.thumbnail = thumbnail;
        bookInfo.authors = authors;
        bookInfo.contents = contents;
        bookInfo.date = date;

        console.log(bookInfo); 
  
  
        // 도서 썸네일 이미지, 제목 출력
        document.getElementById("title").innerHTML = book.documents[0].title;
        document.getElementById("thumbnail").src = book.documents[0].thumbnail;
  
        // 코멘트 입력폼 노출
        document.getElementById("commentForm").style.display = "block";
      })
      .fail(function(e){
        console.log(e.responseJSON);
        alert("찾으시는 책 정보가 없습니다.");
      });
}


// 코멘트 저장 버튼 클릭 시 이벤트
function saveComment(){
  // e.preventDefault();

  let comment = document.getElementById("comment").value;
  bookInfo.comment = comment;
  
  // console.log(bookInfo);
  
  const json = JSON.stringify(bookInfo);
  // console.log(json);


  // 도서정보 post로 저장
  $.ajax({
    url: "http://localhost:4000/books", //주소
    data: bookInfo, //전송 데이터
    type: "POST", //전송 타입    		
  })
  .done(function(response) {
    console.log(response);
    createDIV(response)
    });
}




  // container 안에 자식 노드로 div 생성
function createDIV(response){
  let bookMark = document.createElement("div"); 
  bookMark.setAttribute("class", "bookMark");
  bookMark.setAttribute("onclick", "showModal(this)");
  document.getElementById("container").prepend(bookMark);
  bookMark.innerHTML = `<div class='commentBox'>${response.comment}</div>
  <div class='titleBox'>${response.title}</div>`;
}


// 모달 띄우기
function showModal(div){
  div.setAttribute("data-bs-toggle", "modal");
  div.setAttribute("data-bs-target", "#bookInfoModal");
  
  modalInput(div)
}

// 모달에 정보 전송
function modalInput(div){
  // 현재 제목
  thisTitle = div.childNodes[2].outerText;

  $.get("http://localhost:4000/books", function(data){
    data.forEach((response) => {
      if(thisTitle == response["title"]){
        document.getElementById("modalThumbnail").src = response["thumbnail"];
        document.getElementById("modalTitle").innerHTML = `<b>제목</b> : ${response["title"]}`;
        document.getElementById("modalAuthors").innerHTML = `<b>작가</b> : ${response["authors[]"]}`;
        document.getElementById("modalContents").innerHTML = `<b>줄거리</b> : ${response["contents"]} ...`;
        document.getElementById("modalDate").innerHTML = `${response["date"]}`;
      }
    });
  });
}

// 날짜 포멧 설정
function dateFormat(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();

  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;
  minute = minute >= 10 ? minute : '0' + minute;

  return date.getFullYear() + '.' + month + '.' + day + ' ' + hour + ':' + minute;
}