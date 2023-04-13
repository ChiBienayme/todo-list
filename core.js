// Action: Là nơi mang các thông tin dùng để gửi từ ứng dụng đến Store. Các thông tin này là 1 object mô tả những gì đã xảy ra.
export default function html([first, ...strings], ...values) {
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()),
        [first]
    )
    .filter(x => x && x !== true || x === 0)
    .join('')

}

// reducer is callback
export function createStore(reducer) {
    /* state chạy reducer() sẽ nhận được {cars:['bmw']} */
    let state = reducer()

    //roots include all elements to render to view
    const roots = new Map()

    function render() {
        //root = key: document.getElementById('root')
        //component: App
        for (const [root, component] of roots) {
            const output = component()
            root.innerHTML = output
        }
    }

    return {
        //enhanced object literal  attach: function() {}
        //tien hanh render ra 2 tham so ma no nhan
        attach(component, root) {
            //set(key = root =document.getElementById('root')
            //value = component = App)
            //roots = new Map() = {document.getElementById('root'):App}
            roots.set(root, component)
            render()
        },
        connect(selector = state => state) {
            //push store to view: conect để lấy giá trị từ state chuyển ra component ấy bạn
            //chay ham component khi data bi thay doi qua ham reducer => connect = component()
            //selector: lua chon di lieu cu the trong store
            //state: gia tri mac dinh

            //props: cong cu du lieu muon truyen vao component sau nay
            //return a function voi doi so la component => return another function (props, tat cac arguments cua function nay) => return component
            //connector = (component) => (props,...args) => (component)(Object.assign({},props,selector(state),...args)) 
            //connector(App) =>  App => (props,...args) => App(Object.assign({},props,selector(state),...args))
            return component => (props, ...args) => 
                //component day cac du lieu cua props, args, state => tat ca deu la objects => merge all by Object.assign
                component(Object.assign({}, props, selector(state), ...args))

                // return function(component){ // Trả về lần 1: App.js: const connector = connect()
                //     return function(props,...args){ // Trả về lần 2: App.js: export default connector(App)
                //         return component(Object.assign({},props,selector(state),...args)) // Trả về lần 3
                //     }
                // } 
        },
        dispatch(action,...args) {
            //view => actions
            //actions => reducers => store updated => view changed: update state when there is a new action from user
            state = reducer(state, action, args)
            render()
        }
    }

}