
import ImageView from "./ImageView";
import Breadcrumb from "./Breadcrumb";
import Nodes from "./Nodes";
import { request } from "./api";
import Loading from "./Loading";


// nodeId: nodes 형태로 데이터를 불러올 때마다 이곳에 데이터를 쌓는다
const cache = {}

// Nodes 조율을 위한 App 컴포넌트
export default function App($app) {
  this.state = {
    isRoot: true,
    nodes: [],
    depth: [],
    selectedFilePath: null,
    isLoading: true
  }

  const imageView = new ImageView({
    $app,
    initialState: this.state.selectedNodeImage
  })

  const breadcrumb = new Breadcrumb({
    $app,
    initialState: this.state.depth,
    onClick: (index) => {
      if(index === null) {
        this.setState({
          ...this.state,
          depth: [],
          nodes: cache.root
        })
        return
      }

      // breadcrumb에서 현재 위치를 누른 경우는 무시함
      if(index === this.state.depth.length - 1) {
        return
      }

      const nextState = { ...this.state }
      const nextDepth = this.state.depth.slice(0, index + 1)

      this.setState({
        ...nextState,
        depth: nextDepth,
        nodes: cache[nextDepth[nextDepth.length - 1].id]
      })
    }
  })

  const loading = new Loading(this.state.isLoading)
  

  // App 컴포넌트에 setState 함수 정의
  this.setState = (nextState) => {
    this.state = nextState
    breadcrumb.setState(this.state.depth)
    nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes
    })
    imageView.setState(this.state.selectedFilePath)
    loading.setState(this.state.isLoading)
  }

  const nodes = new Nodes({
    $app,
    initialState: {
      isRoot: this.state.isRoot,
      nodes: this.state.nodes
    },
    onClick: async (node) => {
      try {
        if(node.type === 'DIRECTORY') {
          if(cache[node.id]) {
            this.setState({
              ...this.state,
              depth: [...this.state.depth, node],
              nodes: nextNodes
            })
          } else {
            const nextNodes = await request(node.id)
            this.setState({
              ...this.state,
              depth: [...this.state.depth, node],
              nodes: nextNodes
            })
            cache[node.id] = nextNodes
          }
          
        } else if(node.type === 'FILE') {
          this.setState({
            ...this.state,
            selectedFilePath: node.filePath
          })
        }
      } catch (e) {
        
      }
    },
    onBackClick: async () => {
      try {
        // 이전 state를 복사하여 처리
        const nextState = { ...this.state }
        nextState.depth.pop()

        const prevNodeId = nextState.depth.length === 0 ? null : nextState.depth[nextState.depth.length - 1].id
        
        // 현재 구현된 코드에서는 불러오는 모든 데이터를 cache에 넣고 있으므로 이전으로 돌아가는 경우
        // 이전 데이터가 cache에 있어야 정상임

        // root 로 경우 이므로 root 처리
        if(prevNodeId === null) {
          const rootNodes = await request()
          this.setState({
            ...nextState,
            isRoot: true,
            nodes: cache.rootNodes
          })
        } else {
          const prevNodes = await request(prevNodeId)
          this.setState({
            ...nextState,
            isRoot: false,
            nodes: cache[prevNodes]
          })
        }
      } catch (e) {
        
      }
    }
  })

  const init = async () => {
    try {
      this.setState({
        ...this.state,
        isLoading: true
      })
      const rootNodes = await request()
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes
      })
      cache.root = rootNodes
    } catch (e) {
      // 에러처리
    } finally {
      this.setState({
        ...this.state,
        isLoading: false
      })
    }
  }
}

