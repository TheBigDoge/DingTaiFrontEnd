<script>
  export default {
    onLaunch: function () {
      console.log('App Launch')
    },
    onShow: function () {
      console.log('App Show')
    },
    onHide: function () {
      console.log('App Hide')
    },
  }
</script>

<style lang="scss">
  @import './uni.scss';

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
