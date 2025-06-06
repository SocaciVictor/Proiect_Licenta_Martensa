const linking = {
  prefixes: ["martensa://"],
  config: {
    screens: {
      "(tabs)": {
        screens: {
          orders: "success", // martensa://success => /orders
          cart: "cancel", // martensa://cancel => /cart
        },
      },
    },
  },
};

export default linking;
