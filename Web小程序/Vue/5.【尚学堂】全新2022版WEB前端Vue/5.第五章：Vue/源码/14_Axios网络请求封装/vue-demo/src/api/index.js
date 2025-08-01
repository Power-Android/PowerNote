import axios from "../utils/request"
import path from "./path"

const api = {
    // 诚品详情地址
    getChengpin(){
        return axios.get(path.baseUrl + path.chengpin)
    }
}

export default api