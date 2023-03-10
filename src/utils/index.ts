const results = [
  {
    address: 'steven',
    win: 1,
    lose: 0,
    tie: 0,
  },
  {
    address: 'jess',
    win: 1,
    lose: 0,
    tie: 0,
  },
  {
    address: 'steven',
    win: 0,
    lose: 1,
    tie: 0,
  },
  {
    address: 'jess',
    win: 1,
    lose: 0,
    tie: 0,
  },
];

// 특정 주소의 결과 값을 조회 * 현재 로직일 그대로 경우
// 흩어져 있는 결과 값을 모아서 하나로 모아서 출력
function resultOfAddress(address: string) {
  const filtered = results
    .filter((el) => el.address === address)
    .reduce(
      (acc, cur) => {
        return {
          address: cur.address,
          win: acc.win + cur.win,
          lose: acc.lose + cur.lose,
          tie: acc.tie + cur.tie,
        };
      },
      {
        address,
        win: 0,
        lose: 0,
        tie: 0,
      }
    );
  console.log(filtered);
}

resultOfAddress('steven');

const result = [
  { address: 'steven', win: 1, lose: 1, tie: 0 },
  { address: 'jess', win: 2, lose: 4, tie: 0 },
];

// 게임 결과를 업데이트할 때 추가하는 방식이 아닌 기존의 결과값을 수정해 저장하는 함수
// 기존의 게임 결과가 존재하는 주소일 경우에는 해당 객체의 값을 업데이트할 수 있다.
// 이 함수를 사용할 경우 조회할 때 위의 resultOfAddress 함수를 사용할 필요가 없다.
function addResultValue() {
  const newResult = { address: 'steven', win: 1, lose: 1, tie: 0 };

  const existedAddress = result.filter(
    (el) => el.address === newResult.address
  );

  if (!existedAddress.length) {
    result.push(newResult);
  }

  const newResults = existedAddress.reduce((acc, cur) => {
    return {
      address: cur.address,
      win: cur.win + newResult.win,
      lose: cur.lose + newResult.lose,
      tie: cur.tie + newResult.tie,
    };
  }, newResult);

  console.log(newResults);
}

addResultValue();

const resultsForPrize = [
  {
    address: 'a',
    win: 1,
    lose: 0,
    tie: 5,
  },
  {
    address: 'b',
    win: 5,
    lose: 0,
    tie: 0,
  },
  {
    address: 'c',
    win: 1,
    lose: 0,
    tie: 10,
  },
  {
    address: 'd',
    win: 3,
    lose: 0,
    tie: 0,
  },
  {
    address: 'e',
    win: 6,
    lose: 0,
    tie: 0,
  },
  {
    address: 'f',
    win: 1,
    lose: 0,
    tie: 1,
  },
];

// 게임 결과 Top 5를 출력하는 함수
// addResultValue 함수로 구현되어 있다고 가정
// 정렬이 되어 있지 않다면 아래 함수 사용
// function topFiveOfResults() {
//   const sortedResults = resultsForPrize
//     .sort((a, b) => {
//       if (b.win > a.win) return 1;
//       if (b.win < a.win) return -1;
//       if (b.win === a.win) {
//         return b.tie - a.tie;
//       }
//     })
//     .slice(0, 5);

//   console.log(sortedResults);
// }

// topFiveOfResults();

// 기존 방식을 사용할 때 결과를 주소를 기반으로 종합해주는 함수
function combineResults() {
  const arr: { address: string; win: number; lose: number; tie: number }[] = [];

  results.forEach((result) => {
    const filtered = arr.filter((el) => result.address === el.address);
    if (!filtered.length) {
      arr.push(result);
    } else {
      const existedResult = filtered[0];
      existedResult.win += result.win;
      existedResult.lose += result.lose;
      existedResult.tie += result.tie;
    }
  });

  console.log(arr);
}

combineResults();
