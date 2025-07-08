// src/themeConfig.js
import { defineConfig, createSystem } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: "#3182CE",
        danger: "#E53E3E",
      },
    },
  },
})

export const system = createSystem({}, config)
