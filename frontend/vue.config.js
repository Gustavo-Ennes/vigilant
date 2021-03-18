module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/global.scss";
        `,
      },
    },
  },
};
