/**
 * Nodes 컴포넌트
 * - 생성된 DOM을 어디에 append 할지 $app 파라미터로 받기
 * - 파라미터는 구조 분해 할당 방식으로 처리([a, b, ...rest] = [10, 20, 30, 40, 50];)
 */

// function 문법 버전
export default function Nodes({ $app, initialState, onClick, onBackClick }) {
  this.state = initialState

  // onClick은 함수이며, 클릭한 Node의 type과 id를 파라미터로 넘겨받음
  this.onClick = onClick
  this.onBackClick = onBackClick

  // Nodes 컴포넌트를 렌더링 할 DOM을 this.$target 이라는 이름으로 생성
  this.$target = document.createElement('ul')
  $app.appendChild(this.$target)

  // state를 받아서 현재 컴포넌트의 state를 변경하고 다시 렌더링하는 함수
  this.setState = (nextState) => {

    // render 함수 내에서 this.state 기준으로 렌더링을 하기 때문에, 
    // 단순히 이렇게만 해주어도 상태 변경시 화변이 알아서 바뀜
    this.state = nextState
    this.render()

  }

  // 파라미터가 없는 Nodes의 render 함수. 현재 상태(this.state) 기준으로 렌더링
  this.render = () => {
    // this.$target.innerHTML = this.state.nodes.map( node => `<li>${node.name}</li>` )
    if(this.state.nodes) {
      const nodesTemplate = this.state.nodes.map( node => {
        const iconPath = node.type === 'FILE' ? './assets/file.png' : './assets/directory.png'
        return `
          <div class="Node" data-node-id="${node.id}">
            <img src="${iconPath}" />
            <div>${node.name}</div>
          </div>
        `
      }).join('')

      // root directory 렌더링이 아닌 경우 뒤로가기를 렌더링
      // 뒤로가기의 경우 data-node-id attribute를 렌더링하지 않음
      this.$target.innerHTML = !this.state.isRoot ? `<div class="Node"><img src="/assets/prev.png"></div>${nodesTemplate}` : nodesTemplate
    }

    // 렌더링된 이후 클릭 가능한 모든 요소에 click 이벤트 걸기
    // 삭제: 이벤트 버블링 방지
    // this.$target.querySelectorAll('.Node').forEach($node => {
    //   $node.addEventListener('click', (e) => {})
    // })

  }

  this.$target.addEventListener('click', (e) => {
    // $target 하위에 있는 HTML 요소 클릭시 이벤트가 상위로 계속 전파되면서
    // $target까지 오게 되는 특성

    // closest를 이용하면 현재 클릭한 요소와 제일 인접한 요소를 가져옴
    const $node = e.target.closest('.Node')
    if($node) {
      // dataset을 통해 data-로 시작하는 attribute를 꺼내올 수 있음.
      const { nodeId } = e.target.dataset
      
      // nodeId가 없는 경우 뒤로가기를 누른것
      if(!nodeId) {
        this.onBackClick()
        return
      }
      const selectedNode = this.state.nodes.find( node => node.id === nodeId )
  
      if(selectedNode) {
        this.onClick(selectedNode)
      }
    }
  })
 

  // 인스턴스화 이후 바로 render 함수를 실행하며 new로 생성하자마자 렌더링 되도록 할 수 있음
  this.render()

  

}

// Class 문법 버전
// class Nodes {

//   // new 키워드를 통해 컴포넌트가 생성되는 시점에 실행됨.
//   // 컴포넌트가 표현될 element를 생성하고 파라메터로 받은 $app에 렌더링
//   constructor({ $app, initialState }) {
//     this.state = initialState
//     this.$target = document.createElement('ul')
//     $app.appendChild(this.$target)
//     this.render()
//   }

//   // 해당 컴포넌트의 state를 갱신. render 함수가 별도의 파라미터 없이 자신의 상태를 기준으로
//   // 렌더링 하도록 작성이 되어있기 때문에 state를 변경하고 다시 render함수를 부르도록 함으로써
//   // 업데이트된 상태를 화면에 반영 가능
//   setState(nextState) {
//     this.state = nextState
//     this.render()
//   }

//   // 해당 컴포넌트의 state를 기준으로 자신의 element에 렌더링
//   // 자신의 상태(state)를 기준으로 렌더링해야하기 때문에 별도의 파라미터를 받지 않아야 함.
//   render() {
//     this.$target.innerHTML = this.state.nodes.map( node => `<li>${node.name}</li>` )
//   }
// }



// // => 실제 DOM을 직접 제어하는 부분 = 컴포넌트가 인스턴스화 되는 시점/render함수가 다시 호출되는 시점
// const $app = document.querySelector('.app')
// const initialState = {
//   nodes: []
// }
// const nodes = new Nodes({
//   $app,
//   initialState
// })

// // 이후 nodes를 갱신할 일이 있다면 nodes.setState를 호출
// const nextState = {
//   nodes: []
// }
// nodes.setState(nextState)


