
export const rules = {
    // components: {},
    data() {
        var checkEmail = (rule, value, callback) => {
            const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (regEmail.test(value)) {
                return callback()
            } else {
                return callback(new Error('请输入合法的邮箱'));
            }
        };
        var checkMobile = (rule, value, callback) => {
            const regMobile = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
            if (regMobile.test(value)) {
                return callback()
            } else {
                return callback(new Error('请输入合法的手机号'));
            }
        };
        return {
            addRules: {
                username: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur", },
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { min: 5, max: 15, message: "长度在 5 到 15 个字符", trigger: "blur", },
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    { validator: checkEmail, trigger: 'blur' },
                ],
                mobile: [
                    { required: true, message: "请输入手机号码", trigger: "blur" },
                    { validator: checkMobile, trigger: 'blur' },
                ],
                roleName: [
                    { required: true, message: "请输入角色名称", trigger: "blur" },
                ],
                roleDesc: [
                    { required: true, message: "请输入角色描述", trigger: "blur" },
                ],
                cat_name: [
                    { required: true, message: "请输入分类名称", trigger: "blur" },
                ],
                attr_name: [
                    { required: true, message: "请输入参数名称", trigger: "blur" },
                ],
            },
        }
    },
    methods: {}
}

export const goods_rules = {
    // components: {},
    data() {
        return {
            addRules: {
                goods_name: [
                    { required: true, message: "请输入商品名称", trigger: "blur" },
                ],
                goods_price: [
                    { required: true, message: "请输入商品价格", trigger: "blur" },
                ],
                goods_weight: [
                    { required: true, message: "请输入商品重量", trigger: "blur" },
                ],
                goods_number: [
                    { required: true, message: "请输入商品数量", trigger: "blur" },
                ],
                goods_cat: [
                    { required: true, message: "请选择商品分类", trigger: "blur" },
                ],
            },
        }
    },
    methods: {}
}

export const order_rules = {
    // components: {},
    data() {
        return {
            addRules: {
                address1: [
                    { required: true, message: "请选择省市区/县", trigger: "blur" },
                ],
                address2: [
                    { required: true, message: "请输入详细地址", trigger: "blur" },
                ],
            },
        }
    },
}