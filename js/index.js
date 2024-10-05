/** 
- (1) 5글자 단어 (존재하는 단어가 아니어도 됨)
(2) 6번의 시도 가능
(3) 존재하면 노란색, 위치도 맞으면 초록색으로 표시
(4) 게임 종료 판단
(추가) 상단에 게임 시간 표시하기

(선택) 키보드에도 동일하게 표시
(선택) 키보드 클릭으로도 입력 가능

*/
const 정답 = "APPLE";
let index = 0;
let attempts = 0; //시도횟수
let timerFlag = 0;

//타이머 함수
let startTime = null;
let interval = null;

function timerFunc() {
  const timeElement = document.querySelector(".time");
  const nowTime = new Date();
  const time = new Date(nowTime - startTime);
  const min = time.getMinutes().toString().padStart(2, "0");
  const sec = time.getSeconds().toString().padStart(2, "0");
  timeElement.innerText = `${min}:${sec}`;
}

function appStart() {
  //게임종료 화면 만들기
  const displayGameover = (result) => {
    const div = document.createElement("div");

    if (result === "correct") {
      div.innerText = `[ ${정답} ] 정답! \n\n 게임이 종료됐습니다.`;
    } else {
      div.innerText = "실패! \n\n 게임이 종료됐습니다.";
    }
    div.classList.add(`result-${result}`);

    div.style = `background-color:var(--${result}); color:#fff; font-weight:bold; font-size: 30px; width:100%; height:300px; position:absolute; top:calc(50% - 150px); display:flex; justify-content:center; align-items: center;`;
    document.body.appendChild(div);
  };

  const gameOver = (result) => {
    //게임종료
    window.removeEventListener("keydown", handleKeydown);
    displayGameover(result);
    //타이머 종료
    clearInterval(interval);
  };

  const nextLine = () => {
    //다음줄로 이동
    attempts++;
    index = 0;
    if (attempts === 6) {
      gameOver("any");
      return;
    }
  };

  const changeElStyle = (el, result, dataKey) => {
    //결과적용
    el.style.background = `var(--${result})`;
    el.style.borderColor = `var(--${result})`;
    el.style.color = "#fff";

    const key = document.querySelector(`.key[data-key='${dataKey}']`);
    key.style.color = "#fff";

    //키보드 적용
    const keyColor = key.style.background;
    if (keyColor.includes(result)) return;
    else if (keyColor.includes("correct")) return;
    else {
      key.style.background = `var(--${result})`;
    }
  };

  const handleEnterKey = () => {
    let correctNum = 0;
    //정답확인
    for (let i = 0; i < 5; i++) {
      const block = document.querySelector(
        `.board-block[data-index='${attempts}${i}']`
      );

      const 입력글자 = block.innerText;
      if (입력글자 === 정답[i]) {
        //정답
        changeElStyle(block, "correct", 입력글자);
        correctNum++;
      } else if (정답.includes(입력글자)) {
        //글자가 정답에 포함되는 경우
        changeElStyle(block, "wrong", 입력글자);
      } else {
        //오답
        changeElStyle(block, "any", 입력글자);
      }
    }

    if (correctNum === 5) gameOver("correct");
    else nextLine();
  };
  const handleBack = () => {
    //취소키 눌렀을 때
    if (index > 0) index--;
    const thisBlock = document.querySelector(
      `.board-block[data-index='${attempts}${index}']`
    );
    thisBlock.innerText = "";
  };

  const setTimer = (e) => {
    //타이머 시작
    if (timerFlag === 0) {
      timerFlag++;
      startTime = new Date();
      interval = setInterval(timerFunc, 1000);
    }
  };

  const handleKeydown = (e) => {
    setTimer();
    const key = e.key.toUpperCase();
    const keyCode = e.keyCode;

    if (key === "BACKSPACE") handleBack();
    else if (index === 5) {
      if (key === "ENTER") handleEnterKey();
      else return;
    } else if (keyCode >= 65 && keyCode <= 90) {
      const thisBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index}']`
      );
      thisBlock.innerText = key;
      index++;
    }
  };

  const handleClick = (e) => {
    const key = e.target.dataset.key;

    setTimer();

    if (key === "BACKSPACE") handleBack();
    else if (index === 5) {
      if (key === "ENTER") handleEnterKey();
      else return;
    } else if (key.length === 1) {
      const thisBlock = document.querySelector(
        `.board-block[data-index='${attempts}${index}']`
      );
      thisBlock.innerText = key;
      index++;
    }
  };
  //키보드를 쳤을 때
  window.addEventListener("keydown", handleKeydown);

  //자판을 눌렀을 때
  const keyList = document.querySelectorAll(".key");
  for (let i = 0; i < keyList.length; i++) {
    keyList[i].addEventListener("click", handleClick);
  }
}

appStart();
