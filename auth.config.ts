// Здеся находится конфиг авторизации

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    // в pages можно добавить кастомные страницы логина, лог аута и страниц с ошибками
    pages: {
      signIn: '/auth/login',
    },
    callbacks: {
        // данный колбэк позволяет проверить, является ли запрос авторизованным для получения доступа к странице. Он вызывается до того как запрос становится завершённым
        authorized({ auth, request: { nextUrl } }) {
          const isLoggedIn = !!auth?.user;
          const isOnTodos = nextUrl.pathname.startsWith('/todos');
          if (isOnTodos) {
            if (isLoggedIn) return true;
            return false; // Редикректить неаутентифицированных пользователей на страницу логина
          } else if (isLoggedIn) {
            return Response.redirect(new URL('/todos', nextUrl));
          }
          return true;
        },
      },
      providers: [],
} satisfies NextAuthConfig;