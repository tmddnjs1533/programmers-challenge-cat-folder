/**
 * fetch
 * - url을 파라미터로 받아 Promise 형태로 처리
 * - fetch로 받는 Promise 객체는 HTTP error 상태를 reject 하지 않음.
 *   => response ok를 체크해야 함
 * - 실제 fetch 함수를 호출하는 부분을 컴포넌트 내에 코딩하지 않고, 별도의 유틸리티 함수로 분리하는 것이 좋음.
 * - 각 컴포넌트가 데이터를 어떤 방식으로 불러올지는 해당 컴포넌트의 관심사가 아니기 때문
 */

// api end point 를 상수처리 해두면 나중에 변경 되었을 경우 처리하기 쉬움.
const API_END_POINT = '...'

/*
const request = (nodeId) => {
  // nodeId 유무에 따라 root directory를 조회할 지 특정 directory를 조회할지 처리
  fetch(`${API_END_POINT}/${nodeId ? nodeId : ''}`)
 .then((response) => {
   if( !response.ok ) {
     throw new Error('http 오류')
   }
   return response.json();
 })
 .catch(e => {
  throw new Error(`오류가 발생하였습니다. ${e.message}`)
 })
}
*/

/**
 * async ~ await 
 * - Promise 형태의 응답을 반환하는 함수의 경우, 동기식 문법으로 작성할 수 있도록 도와주는 문법
 */
 export const request = async (nodeId) => {
  try {
    const res = await fetch(`${API_END_POINT}/${nodeId ? nodeId : ''}`)
    if(!res.ok) {
      throw new Error('http 오류')
    }
    return await res.json()
  } catch(e) {
    throw new Error(`오류가 발생하였습니다. ${e.message}`)
  }
}