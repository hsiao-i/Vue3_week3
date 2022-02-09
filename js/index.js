// import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

let productModal = '';
let delProductModal = '';
const app = Vue.createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'hsiaoi',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
    };
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios
        .post(url)
        .then((res) => {
          alert(res.data.message);
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = 'login.html';
        });
    },
    //取得產品列表
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
      axios
        .get(url)
        .then((res) => {
          alert(res.data.message);
          this.products = res.data.products;
          // console.log(this.products);
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    //開啟 bootstrap modal
    openModal(status, item) {
      if (status === 'new') {
        this.tempProduct = {};
        productModal.show();
        this.isNew = true;
      } else if (status === 'edit') {
        this.tempProduct = { ...item };
        productModal.show();
        this.isNew = false;
      } else if (status === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show();
      }
    },

    //新增及編輯產品
    updateProduct() {
      //新增的 api
      let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      if (!this.isNew) {
        url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put';
      }

      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    createImage() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },

    //刪除商品
    deleteProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          delProductModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },

  mounted() {
    //取得 cookie 裡的 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    //確認登入
    this.checkAdmin();

    //bootstrap modal 實體
    productModal = new bootstrap.Modal(
      document.getElementById('productModal'),
      {
        keyboard: false,
      }
    );

    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal'),
      {
        keyboard: false,
      }
    );
  },
});

app.mount('#app');
