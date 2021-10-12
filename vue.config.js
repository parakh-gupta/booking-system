module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    port: 8080,
    proxy: {
      "^/api": {
        target: "http://localhost:8885",
        ws: true,
        changeOrigin: true,
      },
      "^/actuator/health": {
        target: "http://localhost:8885",
      },
    },
  },
};
