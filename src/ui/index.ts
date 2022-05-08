import Vue from 'vue'
import {
  Button,
  Modal,
  FormModel,
  Input,
  InputNumber,
  Select,
  Dropdown,
  Menu,
  Spin,
  Cascader,
  Table,
  ConfigProvider,
  message,
  notification,
} from 'ant-design-vue'

const antComps = [
  Button,
  Modal,
  FormModel,
  Input,
  InputNumber,
  Select,
  Select.Option,
  Dropdown,
  Dropdown.Button,
  Menu,
  Menu.Item,
  Spin,
  Cascader,
  Table,
  ConfigProvider,
]

// 注册组件
for (const comp of antComps) {
  Vue.component(comp.name, comp)
}

Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$destroyAll = Modal.destroyAll

// FormModel 表单
Vue.use(FormModel)
