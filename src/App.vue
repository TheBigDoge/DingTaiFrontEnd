<script lang="ts">
import { handleAfterLogin, LoginResponse, startup, WechatLogin } from './api/login';
import { newUser } from './api/user';
import { GlobalData } from './store';
import { delAuthToken, getAuthToken } from './utils/auth';
import { ErrorCode } from './utils/error';
  async function userLogin(res: UniApp.LoginRes): Promise<LoginResponse | null> {
    if (import.meta.env.UNI_PLATFORM === 'mp-weixin') {
      console.log(`平台为微信小程序, 登录code=${res.code}`);
      return await WechatLogin({code: res.code})
    }

    uni.showToast({title: '未知平台'})
    return null;
  }

  export default {
    onShow: function () {
      console.log('App Launch')

      // 逻辑：
      // 1. 看有没有存储的token，如果有，那么试试获取用户信息(/api/v1/login)
      //    若登录成功（有user信息和token信息），即认为有登录态；若登录失败，继续走下面的逻辑
      // 2. 调用 uni.login 然后跟平台通信。得到平台的code
      // 3. 尝试使用平台的code向后端通信，获取新的token，认为有登录态。
      // 4. 若没有token（特殊错误码），那么进行注册逻辑。

      const token = getAuthToken();
      if (token) {
        startup()
          .then(res => {
            if (!res.token) {
              // 没有登录态，尝试走平台登录
              uni.login()
                .then(userLogin)
                .then(res => {
                  if (res) {
                    console.log('平台登录成功', res);
                    return handleAfterLogin(res);
                  }
                })
                .catch(err => {
                  console.log('登录失败', err);
                  delAuthToken();
                  GlobalData.set_premium_status(null);
                  GlobalData.set_user(null);

                  if (import.meta.env.UNI_PLATFORM === 'mp-weixin' && err.code === ErrorCode.WechatRegisterRequired) {
                    // 弹窗，进入小程序授权界面，让用户点击后进行注册
                    uni.navigateTo({
                      'url': '/pages/login/login'
                    })
                  }
                })
            }
          })
      }
    },
  }
</script>

<style lang="scss">
  @import './uni';

  page,
  view,
  text,
  scroll-view,
  swiper,
  swiper-item,
  image,
  navigator,
  input,
  textarea,
  button,
  label,
  form {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  text,
  view,
  input,
  textarea,
  button {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
